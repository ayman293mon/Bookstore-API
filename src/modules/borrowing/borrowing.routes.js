const express = require('express');
const router = express.Router();
const borrowingController = require('./borrowing.controller');
const validateSchema = require('../../middlewares/validateSchema');
const { checkoutSchema, returnSchema } = require('./borrowing.validator');
const { sensitiveOpsLimiter } = require('../../middlewares/rateLimiter');

router.post('/checkout', sensitiveOpsLimiter, validateSchema(checkoutSchema), borrowingController.checkoutBook);
router.post('/return', sensitiveOpsLimiter, validateSchema(returnSchema), borrowingController.returnBook);

router.get('/borrower/:borrowerId', borrowingController.getBorrowerBooks);
router.get('/overdue', borrowingController.getOverdueBooks);

module.exports = router;
