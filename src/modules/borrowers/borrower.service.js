const borrowerRepository = require('./borrower.repository');
const db = require('../../config/db');
const { NotFoundError, ConflictError, BadRequestError } = require('../../utils/errors');

class BorrowerService {
  async getAllBorrowers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { records, totalRecords } = await borrowerRepository.findAll(limit, offset);
    
    return {
      data: records,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        limit
      }
    };
  }

  async getBorrowerById(id) {
    const borrower = await borrowerRepository.findById(id);
    if (!borrower) {
      throw new NotFoundError('Borrower not found');
    }
    return borrower;
  }

  async createBorrower(data) {
    try {
      return await borrowerRepository.create(data);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictError('A borrower with this email already exists');
      }
      throw error;
    }
  }

  async updateBorrower(id, data) {
    await this.getBorrowerById(id);
    
    try {
      return await borrowerRepository.update(id, data);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictError('This email is already taken by another borrower');
      }
      throw error;
    }
  }

  async deleteBorrower(id) {
    await this.getBorrowerById(id);
    
    const borrowsResult = await db.query('SELECT count(*) FROM borrow_records WHERE borrower_id = $1 AND status = \'BORROWED\'', [id]);
    const activeBorrows = parseInt(borrowsResult.rows[0].count);
    
    if (activeBorrows > 0) {
      throw new BadRequestError('Cannot delete borrower with unreturned books');
    }

    await borrowerRepository.delete(id);
  }
}

module.exports = new BorrowerService();
