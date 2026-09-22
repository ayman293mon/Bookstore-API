const request = require('supertest');
const app = require('../src/app');
const borrowingRepository = require('../src/modules/borrowing/borrowing.repository');
const jwt = require('jsonwebtoken');

jest.mock('../src/modules/borrowing/borrowing.repository');

const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
const authHeader = `Bearer ${token}`;

describe('Borrowing API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/borrowing/checkout', () => {
    it('should return 201 on successful checkout', async () => {
      const checkoutData = { book_id: 1, borrower_id: 1, due_date: '2026-12-31' };
      borrowingRepository.checkout.mockResolvedValue({ id: 1, ...checkoutData, status: 'BORROWED' });

      const res = await request(app)
        .post('/api/borrowing/checkout')
        .set('Authorization', authHeader)
        .send(checkoutData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
    });

    it('should return 400 if there are no available copies left', async () => {
      const checkoutData = { book_id: 1, borrower_id: 1, due_date: '2026-12-31' };
      borrowingRepository.checkout.mockRejectedValue(new Error('No available copies of this book right now'));

      const res = await request(app)
        .post('/api/borrowing/checkout')
        .set('Authorization', authHeader)
        .send(checkoutData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('No available copies');
    });

    it('should return 400 if the book ID does not exist', async () => {
      const checkoutData = { book_id: 999, borrower_id: 1, due_date: '2026-12-31' };
      borrowingRepository.checkout.mockRejectedValue(new Error('Book not found'));

      const res = await request(app)
        .post('/api/borrowing/checkout')
        .set('Authorization', authHeader)
        .send(checkoutData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('POST /api/borrowing/return', () => {
    it('should return 200 on successful return', async () => {
      const returnData = { book_id: 1, borrower_id: 1 };
      borrowingRepository.returnBook.mockResolvedValue({ id: 1, ...returnData, status: 'RETURNED' });

      const res = await request(app)
        .post('/api/borrowing/return')
        .set('Authorization', authHeader)
        .send(returnData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.status).toEqual('RETURNED');
    });

    it('should return 400 if there is no active borrow record', async () => {
      const returnData = { book_id: 1, borrower_id: 1 };
      borrowingRepository.returnBook.mockRejectedValue(new Error('No active borrow record found for this book and borrower'));

      const res = await request(app)
        .post('/api/borrowing/return')
        .set('Authorization', authHeader)
        .send(returnData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('No active borrow record');
    });
  });
});
