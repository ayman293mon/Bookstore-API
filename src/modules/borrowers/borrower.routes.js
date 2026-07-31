const express = require('express');
const router = express.Router();
const borrowerController = require('./borrower.controller');
const validateSchema = require('../../middlewares/validateSchema');
const { createBorrowerSchema, updateBorrowerSchema } = require('./borrower.validator');

router.get('/', borrowerController.getAllBorrowers);
router.get('/:id', borrowerController.getBorrowerById);

router.post('/', validateSchema(createBorrowerSchema), borrowerController.createBorrower);
router.patch('/:id', validateSchema(updateBorrowerSchema), borrowerController.updateBorrower);
router.delete('/:id', borrowerController.deleteBorrower);

module.exports = router;
