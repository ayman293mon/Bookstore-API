const reportService = require('./report.service');

class ReportController {
  _sendCSV(res, filename, csvData) {
    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csvData);
  }

  exportPeriod = async (req, res, next) => {
    try {
      const { start_date, end_date } = req.query;
      if (!start_date || !end_date) {
        return res.status(400).json({ success: false, message: 'start_date and end_date are required' });
      }
      const csv = await reportService.generateBorrowingPeriodCSV(start_date, end_date);
      this._sendCSV(res, `borrowing_${start_date}_to_${end_date}.csv`, csv);
    } catch (error) { next(error); }
  };

  exportOverdueLastMonth = async (req, res, next) => {
    try {
      const csv = await reportService.generateOverdueLastMonthCSV();
      this._sendCSV(res, 'overdue_last_month.csv', csv);
    } catch (error) { next(error); }
  };

  exportBorrowingLastMonth = async (req, res, next) => {
    try {
      const csv = await reportService.generateBorrowingLastMonthCSV();
      this._sendCSV(res, 'borrowing_last_month.csv', csv);
    } catch (error) { next(error); }
  };
}

module.exports = new ReportController();
