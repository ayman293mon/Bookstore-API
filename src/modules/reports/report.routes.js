const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');

router.get('/export-period', reportController.exportPeriod);
router.get('/export-overdue-last-month', reportController.exportOverdueLastMonth);
router.get('/export-borrowing-last-month', reportController.exportBorrowingLastMonth);

module.exports = router;
