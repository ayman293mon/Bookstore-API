const Joi = require('joi');

const checkoutSchema = Joi.object({
  book_id: Joi.number().integer().required(),
  borrower_id: Joi.number().integer().required(),
  due_date: Joi.date().iso().greater('now').required()
});

const returnSchema = Joi.object({
  book_id: Joi.number().integer().required(),
  borrower_id: Joi.number().integer().required()
});

module.exports = {
  checkoutSchema,
  returnSchema
};
