const request = require('supertest');
const app = require('../src/app');
const bookRepository = require('../src/modules/books/book.repository');
const jwt = require('jsonwebtoken');

jest.mock('../src/modules/books/book.repository');

const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
const authHeader = `Bearer ${token}`;

describe('Books API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/books', () => {
    it('should return 200 and a list of books', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' }
      ];
      bookRepository.findAll.mockResolvedValue({ records: mockBooks, totalRecords: 2 });

      const res = await request(app)
        .get('/api/books')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.totalRecords).toBe(2);
      expect(bookRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/books');
      expect(res.statusCode).toEqual(401); 
    });
  });

  describe('POST /api/books', () => {
    it('should return 201 and create a book', async () => {
      const newBookData = {
        isbn: '1234567890123',
        title: 'New Book',
        author: 'New Author',
        published_year: 2023,
        quantity: 5,
        shelf_location: 'A1'
      };

      bookRepository.findByIsbn.mockResolvedValue(null); 
      bookRepository.create.mockResolvedValue({ id: 1, ...newBookData });

      const res = await request(app)
        .post('/api/books')
        .set('Authorization', authHeader)
        .send(newBookData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBeTruthy();
      expect(res.body.data.title).toEqual('New Book');
      expect(bookRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if validation fails', async () => {
      const invalidData = {
        title: 'Missing ISBN'
      };

      const res = await request(app)
        .post('/api/books')
        .set('Authorization', authHeader)
        .send(invalidData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
      expect(res.body.message).toContain('Validation Error');
    });

    it('should return 409 if ISBN already exists', async () => {
      const newBookData = {
        isbn: '1234567890123',
        title: 'New Book',
        author: 'New Author',
        quantity: 5,
        shelf_location: 'A1'
      };

      bookRepository.findByIsbn.mockResolvedValue({ id: 1 });
      
      // Simulate ConflictError from service layer
      const { ConflictError } = require('../src/utils/errors');
      bookRepository.create.mockRejectedValue(new ConflictError('A book with this ISBN already exists'));

      const res = await request(app)
        .post('/api/books')
        .set('Authorization', authHeader)
        .send(newBookData);

      expect(res.statusCode).toEqual(409);
    });
  });
});
