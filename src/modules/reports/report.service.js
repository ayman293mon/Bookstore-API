const { Parser } = require('json2csv');
const reportRepository = require('./report.repository');

class ReportService {
  async generateBorrowingPeriodCSV(startDate, endDate) {
    const data = await reportRepository.getBorrowingByPeriod(startDate, endDate);
    return this._convertToCSV(data);
  }

  async generateOverdueLastMonthCSV() {
    const data = await reportRepository.getOverdueLastMonth();
    return this._convertToCSV(data);
  }

  async generateBorrowingLastMonthCSV() {
    const data = await reportRepository.getBorrowingLastMonth();
    return this._convertToCSV(data);
  }

  _convertToCSV(data) {
    if (!data || data.length === 0) {
      return ''; 
    }
    const parser = new Parser();
    return parser.parse(data);
  }
}

module.exports = new ReportService();
