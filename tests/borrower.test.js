const request = require('supertest');
const app = require('../src/app');
const borrowerRepository = require('../src/modules/borrowers/borrower.repository');
const jwt = require('jsonwebtoken');
const db = require('../src/config/db');

jest.mock('../src/modules/borrowers/borrower.repository');
jest.mock('../src/config/db');

const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
const authHeader = `Bearer ${token}`;

describe('Borrowers API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/borrowers', () => {
    it('should return 200, a list of borrowers, and metadata', async () => {
      const mockBorrowers = [
        { id: 1, email: 'john@example.com', name: 'John Doe' },
        { id: 2, email: 'jane@example.com', name: 'Jane Doe' }
      ];
      
      borrowerRepository.findAll.mockResolvedValue({ records: mockBorrowers, totalRecords: 2 });

      const res = await request(app)
        .get('/api/borrowers?page=1&limit=10')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.totalRecords).toBe(2);
    });
  });

  describe('POST /api/borrowers', () => {
    it('should return 201 on successful creation', async () => {
      const newBorrower = { email: 'new@example.com', name: 'New User' };
      borrowerRepository.create.mockResolvedValue({ id: 3, ...newBorrower });

      const res = await request(app)
        .post('/api/borrowers')
        .set('Authorization', authHeader)
        .send(newBorrower);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.email).toEqual(newBorrower.email);
    });

    it('should return 409 if the email is a duplicate', async () => {
      const newBorrower = { email: 'dup@example.com', name: 'Dup User' };
      
      const uniqueViolationError = new Error('duplicate key value');
      uniqueViolationError.code = '23505';
      
      borrowerRepository.create.mockRejectedValue(uniqueViolationError);

      const res = await request(app)
        .post('/api/borrowers')
        .set('Authorization', authHeader)
        .send(newBorrower);

      expect(res.statusCode).toEqual(409);
    });
  });

  describe('DELETE /api/borrowers/:id', () => {
    it('should return 200 on successful deletion', async () => {
      borrowerRepository.findById.mockResolvedValue({ id: 1, email: 'john@example.com' });
      db.query.mockResolvedValue({ rows: [{ count: '0' }] }); // No active borrows
      borrowerRepository.delete.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .delete('/api/borrowers/1')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('deleted successfully');
    });

    it('should return 400 if the borrower still has unreturned books', async () => {
      borrowerRepository.findById.mockResolvedValue({ id: 1, email: 'john@example.com' });
      db.query.mockResolvedValue({ rows: [{ count: '2' }] }); // 2 active borrows

      const res = await request(app)
        .delete('/api/borrowers/1')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Cannot delete borrower with unreturned books');
    });
  });
});
