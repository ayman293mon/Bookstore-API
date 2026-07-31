const borrowingService = require('./borrowing.service');

class BorrowingController {
  checkoutBook = async (req, res, next) => {
    try {
      const record = await borrowingService.checkoutBook(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (error) { next(error); }
  };

  returnBook = async (req, res, next) => {
    try {
      const record = await borrowingService.returnBook(req.body);
      res.status(200).json({ success: true, data: record });
    } catch (error) { next(error); }
  };

  getBorrowerBooks = async (req, res, next) => {
    try {
      const books = await borrowingService.getBorrowerBooks(req.params.borrowerId);
      res.status(200).json({ success: true, data: books });
    } catch (error) { next(error); }
  };

  getOverdueBooks = async (req, res, next) => {
    try {
      const books = await borrowingService.getOverdueBooks();
      res.status(200).json({ success: true, data: books });
    } catch (error) { next(error); }
  };
}

module.exports = new BorrowingController();
