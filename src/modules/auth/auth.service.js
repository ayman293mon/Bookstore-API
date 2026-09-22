const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const { ConflictError, UnauthorizedError } = require('../../utils/errors');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

class AuthService {
  async register(data) {
    const { email, password, role } = data;
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      return await authRepository.createUser(email, hashedPassword, role);
    } catch (error) {
      // PostgreSQL unique violation error code is 23505
      if (error.code === '23505') {
        throw new ConflictError('Email already in use');
      }
      throw error;
    }
  }

  async login(data) {
    const { email, password } = data;

    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}

module.exports = new AuthService();
