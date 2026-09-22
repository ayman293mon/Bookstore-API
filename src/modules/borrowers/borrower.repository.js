const db = require('../../config/db');

class BorrowerRepository {
  async findAll(limit = 10, offset = 0) {
    const countResult = await db.query('SELECT COUNT(*) FROM borrowers');
    const totalRecords = parseInt(countResult.rows[0].count, 10);

    const result = await db.query('SELECT * FROM borrowers ORDER BY registered_date DESC LIMIT $1 OFFSET $2', [limit, offset]);
    
    return {
      records: result.rows,
      totalRecords
    };
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM borrowers WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM borrowers WHERE email = $1', [email]);
    return result.rows[0];
  }

  async create(data) {
    const { email, name } = data;
    const query = `
      INSERT INTO borrowers (email, name)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await db.query(query, [email, name]);
    return result.rows[0];
  }

  async update(id, updateFields) {
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);
    
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = `
      UPDATE borrowers 
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;
    
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM borrowers WHERE id = $1 RETURNING id;', [id]);
    return result.rows[0];
  }
}

module.exports = new BorrowerRepository();
