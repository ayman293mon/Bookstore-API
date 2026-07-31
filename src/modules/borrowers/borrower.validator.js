const Joi = require('joi');

const createBorrowerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(150).required()
});

const updateBorrowerSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string().min(2).max(150),
  is_active: Joi.boolean()
}).min(1);

module.exports = {
  createBorrowerSchema,
  updateBorrowerSchema
};
