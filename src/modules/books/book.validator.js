const Joi = require('joi');

const createBookSchema = Joi.object({
  isbn: Joi.string().length(13).required(),
  title: Joi.string().min(1).max(255).required(),
  author: Joi.string().min(1).max(255).required(),
  published_year: Joi.number().integer().min(1000).max(new Date().getFullYear()),
  quantity: Joi.number().integer().min(1).required(),
  shelf_location: Joi.string().min(1).max(50).required()
});

const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  author: Joi.string().min(1).max(255),
  published_year: Joi.number().integer().min(1000).max(new Date().getFullYear()),
  quantity: Joi.number().integer().min(1),
  shelf_location: Joi.string().min(1).max(50)
}).min(1);

module.exports = {
  createBookSchema,
  updateBookSchema
};
