const bookRepository = require('./book.repository');

class BookService {
  async getAllBooks(search) {
    return await bookRepository.findAll(search);
  }

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }
    return book;
  }

  async createBook(data) {
    const existing = await bookRepository.findByIsbn(data.isbn);
    if (existing) {
      const error = new Error('A book with this ISBN already exists');
      error.statusCode = 409;
      throw error;
    }
    return await bookRepository.create(data);
  }

  async updateBook(id, data) {
    const existing = await this.getBookById(id);

    if (data.quantity !== undefined) {
      const difference = data.quantity - existing.quantity;
      const newAvailable = existing.available_quantity + difference;
      
      if (newAvailable < 0) {
        const error = new Error('Cannot reduce quantity below currently borrowed copies');
        error.statusCode = 400;
        throw error;
      }
      data.available_quantity = newAvailable;
    }

    return await bookRepository.update(id, data);
  }

  async deleteBook(id) {
    const book = await this.getBookById(id);

    if (book.quantity !== book.available_quantity) {
      const error = new Error('Cannot delete book while copies are currently borrowed');
      error.statusCode = 400;
      throw error;
    }

    await bookRepository.delete(id);
  }
}

module.exports = new BookService();
