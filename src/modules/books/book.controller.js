const bookService = require('./book.service');

class BookController {
  getAllBooks = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await bookService.getAllBooks(req.query.search, page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
  };

  getBookById = async (req, res, next) => {
    try {
      const book = await bookService.getBookById(req.params.id);
      res.status(200).json({ success: true, data: book });
    } catch (error) { next(error); }
  };

  createBook = async (req, res, next) => {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json({ success: true, data: book });
    } catch (error) { next(error); }
  };

  updateBook = async (req, res, next) => {
    try {
      const book = await bookService.updateBook(req.params.id, req.body);
      res.status(200).json({ success: true, data: book });
    } catch (error) { next(error); }
  };

  deleteBook = async (req, res, next) => {
    try {
      await bookService.deleteBook(req.params.id);
      res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error) { next(error); }
  };
}

module.exports = new BookController();
