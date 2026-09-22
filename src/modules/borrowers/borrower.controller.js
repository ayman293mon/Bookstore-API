const borrowerService = require('./borrower.service');

class BorrowerController {
  getAllBorrowers = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await borrowerService.getAllBorrowers(page, limit);
      res.status(200).json({ success: true, ...result });
    } catch (error) { next(error); }
  };

  getBorrowerById = async (req, res, next) => {
    try {
      const borrower = await borrowerService.getBorrowerById(req.params.id);
      res.status(200).json({ success: true, data: borrower });
    } catch (error) { next(error); }
  };

  createBorrower = async (req, res, next) => {
    try {
      const borrower = await borrowerService.createBorrower(req.body);
      res.status(201).json({ success: true, data: borrower });
    } catch (error) { next(error); }
  };

  updateBorrower = async (req, res, next) => {
    try {
      const borrower = await borrowerService.updateBorrower(req.params.id, req.body);
      res.status(200).json({ success: true, data: borrower });
    } catch (error) { next(error); }
  };

  deleteBorrower = async (req, res, next) => {
    try {
      await borrowerService.deleteBorrower(req.params.id);
      res.status(200).json({ success: true, message: 'Borrower deleted successfully' });
    } catch (error) { next(error); }
  };
}

module.exports = new BorrowerController();
