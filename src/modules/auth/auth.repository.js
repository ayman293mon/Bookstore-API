const db = require('../../config/db');

class AuthRepository {
  async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async createUser(email, hashedPassword, role = 'admin') {
    const query = `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, created_at;
    `;
    const result = await db.query(query, [email, hashedPassword, role]);
    return result.rows[0];
  }
}

module.exports = new AuthRepository();
