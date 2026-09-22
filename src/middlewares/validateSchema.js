const { BadRequestError } = require('../utils/errors');

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      
      return next(new BadRequestError(`Validation Error: ${errorMessage}`));
    }
    next();
  };
};

module.exports = validateSchema;
