const borrowerRepository = require('./borrower.repository');
const db = require('../../config/db');
class BorrowerService {
  async getAllBorrowers() {
    return await borrowerRepository.findAll();
  }

  async getBorrowerById(id) {
    const borrower = await borrowerRepository.findById(id);
    if (!borrower) {
      const error = new Error('Borrower not found');
      error.statusCode = 404;
      throw error;
    }
    return borrower;
  }

  async createBorrower(data) {
    const existing = await borrowerRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('A borrower with this email already exists');
      error.statusCode = 409;
      throw error;
    }
    return await borrowerRepository.create(data);
  }

  async updateBorrower(id, data) {
    await this.getBorrowerById(id);
    
    if (data.email) {
      const existing = await borrowerRepository.findByEmail(data.email);
      if (existing && existing.id !== parseInt(id)) {
        const error = new Error('This email is already taken by another borrower');
        error.statusCode = 409;
        throw error;
      }
    }

    return await borrowerRepository.update(id, data);
  }

  async deleteBorrower(id) {
    await this.getBorrowerById(id);
    
    const borrowsResult = await db.query('SELECT count(*) FROM borrow_records WHERE borrower_id = $1 AND status = \'BORROWED\'', [id]);
    const activeBorrows = parseInt(borrowsResult.rows[0].count);
    
    if (activeBorrows > 0) {
      const error = new Error('Cannot delete borrower with unreturned books');
      error.statusCode = 400;
      throw error;
    }

    await borrowerRepository.delete(id);
  }
}

module.exports = new BorrowerService();
