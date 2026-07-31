const express = require('express');
const router = express.Router();
const bookController = require('./book.controller');
const validateSchema = require('../../middlewares/validateSchema');
const { createBookSchema, updateBookSchema } = require('./book.validator');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);

router.post('/', validateSchema(createBookSchema), bookController.createBook);
router.patch('/:id', validateSchema(updateBookSchema), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
