const bookRepository = require('./book.repository');
const { NotFoundError, ConflictError, BadRequestError } = require('../../utils/errors');

class BookService {
  async getAllBooks(search, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { records, totalRecords } = await bookRepository.findAll(search, limit, offset);
    
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

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new NotFoundError('Book not found');
    }
    return book;
  }

  async createBook(data) {
    const existing = await bookRepository.findByIsbn(data.isbn);
    if (existing) {
      throw new ConflictError('A book with this ISBN already exists');
    }
    try {
      return await bookRepository.create(data);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictError('A book with this ISBN already exists');
      }
      throw error;
    }
  }

  async updateBook(id, data) {
    try {
      return await bookRepository.update(id, data);
    } catch (err) {
      if (err.message === 'NOT_FOUND') {
        throw new NotFoundError('Book not found');
      }
      if (err.message === 'QUANTITY_ERROR') {
        throw new BadRequestError('Cannot reduce quantity below currently borrowed copies');
      }
      if (err.code === '23505') {
        throw new ConflictError('A book with this ISBN already exists');
      }
      throw err;
    }
  }

  async deleteBook(id) {
    const book = await this.getBookById(id);

    if (book.quantity !== book.available_quantity) {
      throw new BadRequestError('Cannot delete book while copies are currently borrowed');
    }

    await bookRepository.delete(id);
  }
}

module.exports = new BookService();
