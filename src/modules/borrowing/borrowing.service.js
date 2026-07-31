const borrowingRepository = require('./borrowing.repository');

class BorrowingService {
  async checkoutBook(data) {
    const { book_id, borrower_id, due_date } = data;
    try {
      return await borrowingRepository.checkout(book_id, borrower_id, due_date);
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('No available copies')) {
        error.statusCode = 400;
      } else if (error.code === '23503') { 
        error.statusCode = 400;
        error.message = 'Invalid book_id or borrower_id';
      }
      throw error;
    }
  }

  async returnBook(data) {
    const { book_id, borrower_id } = data;
    try {
      return await borrowingRepository.returnBook(book_id, borrower_id);
    } catch (error) {
      if (error.message.includes('No active borrow record')) {
        error.statusCode = 400;
      }
      throw error;
    }
  }

  async getBorrowerBooks(borrowerId) {
    return await borrowingRepository.getBorrowerBooks(borrowerId);
  }

  async getOverdueBooks() {
    return await borrowingRepository.getOverdueBooks();
  }
}

module.exports = new BorrowingService();
