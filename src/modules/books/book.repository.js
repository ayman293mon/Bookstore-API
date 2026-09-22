const db = require('../../config/db');

class BookRepository {
  async findAll(searchTerm = '', limit = 10, offset = 0) {
    let baseQuery = 'FROM books';
    let params = [];

    if (searchTerm) {
      baseQuery += ' WHERE title ILIKE $1 OR author ILIKE $1 OR isbn ILIKE $1';
      params.push(`%${searchTerm}%`);
    }

    const countQuery = `SELECT COUNT(*) ${baseQuery}`;
    const countResult = await db.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].count, 10);

    const dataQuery = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const dataParams = [...params, limit, offset];
    
    const result = await db.query(dataQuery, dataParams);
    
    return {
      records: result.rows,
      totalRecords
    };
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
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const bookRes = await client.query('SELECT quantity, available_quantity FROM books WHERE id = $1 FOR UPDATE', [id]);
      if (bookRes.rows.length === 0) {
        throw new Error('NOT_FOUND');
      }
      
      const existingBook = bookRes.rows[0];

      if (updateFields.quantity !== undefined) {
        const difference = updateFields.quantity - existingBook.quantity;
        const newAvailable = existingBook.available_quantity + difference;
        
        if (newAvailable < 0) {
          throw new Error('QUANTITY_ERROR');
        }
        updateFields.available_quantity = newAvailable;
      }

      const keys = Object.keys(updateFields);
      const values = Object.values(updateFields);
      
      const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const query = `
        UPDATE books 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${keys.length + 1}
        RETURNING *;
      `;
      
      const result = await client.query(query, [...values, id]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING id;', [id]);
    return result.rows[0];
  }
}

module.exports = new BookRepository();
