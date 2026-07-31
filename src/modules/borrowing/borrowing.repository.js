const db = require('../../config/db');

class BorrowingRepository {
  async checkout(bookId, borrowerId, dueDate) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      
      const bookResult = await client.query('SELECT available_quantity FROM books WHERE id = $1 FOR UPDATE', [bookId]);
      
      if (bookResult.rows.length === 0) {
        throw new Error('Book not found');
      }
      
      if (bookResult.rows[0].available_quantity <= 0) {
        throw new Error('No available copies of this book right now');
      }

      await client.query('UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1', [bookId]);

      const recordQuery = `
        INSERT INTO borrow_records (book_id, borrower_id, due_date, status)
        VALUES ($1, $2, $3, 'BORROWED')
        RETURNING *;
      `;
      const recordResult = await client.query(recordQuery, [bookId, borrowerId, dueDate]);

      await client.query('COMMIT');
      return recordResult.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async returnBook(bookId, borrowerId) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const recordResult = await client.query(`
        SELECT id FROM borrow_records 
        WHERE book_id = $1 AND borrower_id = $2 AND status = 'BORROWED'
        FOR UPDATE
      `, [bookId, borrowerId]);

      if (recordResult.rows.length === 0) {
        throw new Error('No active borrow record found for this book and borrower');
      }

      const recordId = recordResult.rows[0].id;
      
      const updateRecordQuery = `
        UPDATE borrow_records 
        SET status = 'RETURNED', return_date = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *;
      `;
      const returnedRecord = await client.query(updateRecordQuery, [recordId]);

      await client.query('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1', [bookId]);

      await client.query('COMMIT');
      return returnedRecord.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getBorrowerBooks(borrowerId) {
    const query = `
      SELECT br.id as record_id, br.borrow_date, br.due_date, br.status, b.id as book_id, b.title, b.author, b.isbn
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      WHERE br.borrower_id = $1 AND br.status = 'BORROWED'
      ORDER BY br.borrow_date DESC
    `;
    const result = await db.query(query, [borrowerId]);
    return result.rows;
  }

  async getOverdueBooks() {
    const query = `
      SELECT br.id as record_id, br.due_date, b.title, b.isbn, bor.name as borrower_name, bor.email as borrower_email
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN borrowers bor ON br.borrower_id = bor.id
      WHERE br.status = 'BORROWED' AND br.due_date < CURRENT_TIMESTAMP
      ORDER BY br.due_date ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = new BorrowingRepository();
