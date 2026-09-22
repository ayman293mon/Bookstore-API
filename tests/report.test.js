const request = require('supertest');
const app = require('../src/app');
const reportRepository = require('../src/modules/reports/report.repository');
const jwt = require('jsonwebtoken');

jest.mock('../src/modules/reports/report.repository');

const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
const authHeader = `Bearer ${token}`;

describe('Reports API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reports/export-period', () => {
    it('should return a CSV file with data when records exist', async () => {
      const mockData = [
        {
          book_title: 'The Great Gatsby',
          borrower_name: 'John Doe',
          borrow_date: '2026-01-01',
          return_date: '2026-01-10'
        }
      ];
      
      reportRepository.getBorrowingByPeriod.mockResolvedValue(mockData);

      const res = await request(app)
        .get('/api/reports/export-period?start_date=2026-01-01&end_date=2026-01-31')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(200);
      expect(res.header['content-type']).toContain('text/csv');
      
      // The file should not be empty
      expect(res.text.length).toBeGreaterThan(0);
      
      // The file should contain the CSV headers and the data
      expect(res.text).toContain('"book_title","borrower_name","borrow_date","return_date"');
      expect(res.text).toContain('"The Great Gatsby","John Doe","2026-01-01","2026-01-10"');
    });

    it('should return an empty string when no records exist', async () => {
      reportRepository.getBorrowingByPeriod.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/reports/export-period?start_date=2026-01-01&end_date=2026-01-31')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(200);
      expect(res.header['content-type']).toContain('text/csv');
      
      // The file should be completely empty
      expect(res.text).toEqual('');
    });

    it('should return 400 if dates are missing', async () => {
      const res = await request(app)
        .get('/api/reports/export-period')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBeFalsy();
    });
  });

  describe('GET /api/reports/export-overdue-last-month', () => {
    it('should return a CSV file with overdue data', async () => {
      const mockData = [
        {
          book_title: 'Clean Code',
          borrower_email: 'jane@example.com',
          due_date: '2026-08-15'
        }
      ];
      
      reportRepository.getOverdueLastMonth.mockResolvedValue(mockData);

      const res = await request(app)
        .get('/api/reports/export-overdue-last-month')
        .set('Authorization', authHeader);

      expect(res.statusCode).toEqual(200);
      expect(res.header['content-type']).toContain('text/csv');
      expect(res.text).toContain('"book_title","borrower_email","due_date"');
      expect(res.text).toContain('"Clean Code","jane@example.com","2026-08-15"');
    });
  });
});
