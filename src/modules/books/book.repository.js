const db = require('../../config/db');

class BookRepository {
  async findAll(searchTerm = '') {
    let query = 'SELECT * FROM books';
    let params = [];

    if (searchTerm) {
      query += ' WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1';
      params.push(`%${searchTerm}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByIsbn(isbn) {
    const result = await db.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
    return result.rows[0];
  }

  async create(bookData) {
    const { isbn, title, author, published_year, quantity, shelf_location } = bookData;
    const query = `
      INSERT INTO books (isbn, title, author, published_year, quantity, available_quantity, shelf_location)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    
    const values = [isbn, title, author, published_year, quantity, quantity, shelf_location];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(id, updateFields) {

    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);
    
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const query = `
      UPDATE books 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;
    
    const result = await db.query(query, [...values, id]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING id;', [id]);
    return result.rows[0];
  }
}

module.exports = new BookRepository();
