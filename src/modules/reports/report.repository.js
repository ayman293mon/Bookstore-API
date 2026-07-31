const db = require('../../config/db');

class ReportRepository {
  async getBorrowingByPeriod(startDate, endDate) {
    const query = `
      SELECT br.id as record_id, br.borrow_date, br.due_date, br.return_date, br.status, 
             b.title as book_title, bor.name as borrower_name
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN borrowers bor ON br.borrower_id = bor.id
      WHERE br.borrow_date >= $1 AND br.borrow_date <= $2
      ORDER BY br.borrow_date DESC
    `;
    const result = await db.query(query, [startDate, endDate]);
    return result.rows;
  }

  async getOverdueLastMonth() {
    const query = `
      SELECT br.id as record_id, br.due_date, b.title, bor.name, bor.email
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN borrowers bor ON br.borrower_id = bor.id
      WHERE br.status = 'BORROWED' 
        AND br.due_date < CURRENT_TIMESTAMP
        AND br.due_date >= (CURRENT_DATE - INTERVAL '1 month')
      ORDER BY br.due_date DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async getBorrowingLastMonth() {
    const query = `
      SELECT br.id as record_id, br.borrow_date, br.status, b.title, bor.name
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN borrowers bor ON br.borrower_id = bor.id
      WHERE br.borrow_date >= (CURRENT_DATE - INTERVAL '1 month')
      ORDER BY br.borrow_date DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = new ReportRepository();
