const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const validateSchema = require('../../middlewares/validateSchema');
const { registerSchema, loginSchema } = require('./auth.validator');

router.post('/register', validateSchema(registerSchema), authController.register);
router.post('/login', validateSchema(loginSchema), authController.login);

module.exports = router;
