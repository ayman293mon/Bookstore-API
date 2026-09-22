const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Library Management System API. Visit /api-docs for documentation.' });
});

const authRoutes = require('./modules/auth/auth.routes');
const bookRoutes = require('./modules/books/book.routes');
const borrowerRoutes = require('./modules/borrowers/borrower.routes');
const borrowingRoutes = require('./modules/borrowing/borrowing.routes');
const reportRoutes = require('./modules/reports/report.routes');
const jwtAuth = require('./middlewares/jwtAuth');

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api', jwtAuth);
app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/borrowing', borrowingRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

module.exports = app;