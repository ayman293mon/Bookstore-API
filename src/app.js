const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Library Management System API' });
});

const bookRoutes = require('./modules/books/book.routes');
const borrowerRoutes = require('./modules/borrowers/borrower.routes');
const borrowingRoutes = require('./modules/borrowing/borrowing.routes');
const reportRoutes = require('./modules/reports/report.routes');
const authMiddleware = require('./middlewares/auth');

app.use('/api', authMiddleware);

app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/borrowing', borrowingRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

module.exports = app;