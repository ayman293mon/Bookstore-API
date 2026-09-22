const request = require('supertest');
const app = require('../src/app');
const authRepository = require('../src/modules/auth/auth.repository');
const bcrypt = require('bcryptjs');

jest.mock('../src/modules/auth/auth.repository');
jest.mock('bcryptjs');

describe('Auth API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 201 on successful registration', async () => {
      const newUser = { email: 'test@example.com', password: 'password123' };
      
      bcrypt.hash.mockResolvedValue('hashed_password');
      authRepository.createUser.mockResolvedValue({ id: 1, email: newUser.email, role: 'admin' });

      const res = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.email).toEqual(newUser.email);
    });

    it('should return 400 for validation errors', async () => {
      const invalidUser = { email: 'not-an-email' }; // Missing password, invalid email

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });

    it('should return 409 if email is already registered', async () => {
      const existingUser = { email: 'test@example.com', password: 'password123' };
      
      bcrypt.hash.mockResolvedValue('hashed_password');
      
      const uniqueViolationError = new Error('duplicate key value violates unique constraint');
      uniqueViolationError.code = '23505';
      
      authRepository.createUser.mockRejectedValue(uniqueViolationError);

      const res = await request(app)
        .post('/api/auth/register')
        .send(existingUser);

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toContain('Email already in use');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and a JWT token on valid credentials', async () => {
      const user = { email: 'test@example.com', password: 'password123' };
      const dbUser = { id: 1, email: user.email, password: 'hashed_password', role: 'admin' };
      
      authRepository.findByEmail.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/auth/login')
        .send(user);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 on invalid password', async () => {
      const user = { email: 'test@example.com', password: 'wrongpassword' };
      const dbUser = { id: 1, email: user.email, password: 'hashed_password', role: 'admin' };
      
      authRepository.findByEmail.mockResolvedValue(dbUser);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/api/auth/login')
        .send(user);

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBeFalsy();
    });
  });
});
