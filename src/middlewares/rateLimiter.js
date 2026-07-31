const rateLimit = require('express-rate-limit');

// Limit each IP to 10 requests per 15 minutes
const sensitiveOpsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = {
  sensitiveOpsLimiter
};