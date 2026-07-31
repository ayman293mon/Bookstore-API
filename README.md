# Bosta Library Management System

This is a comprehensive RESTful API for a Library Management System built with Node.js, Express, and PostgreSQL. It fulfills all functional requirements, non-functional requirements (Clean Architecture, Performance via Indexing), and **all bonus optional tasks**.

## Features

- **Books Management**: Add, Update, Delete, List, and Search books.
- **Borrowers Management**: Register, Update, Delete, List borrowers.
- **Borrowing Process**: Checkout books, Return books, list overdue books, and list books currently held by a borrower.
- **Analytics & Exports (Bonus)**: Export CSV reports for borrowing periods and overdue items.
- **Security & Rate Limiting (Bonus)**: Basic Authentication on all API endpoints and Rate Limiting on Checkout/Return endpoints.
- **Dockerized (Bonus)**: Full application and database setup via `docker-compose`.
- **Unit Tests (Bonus)**: Jest tests covering the Books module endpoints.

## Prerequisites

- Docker and Docker Compose (Easiest way to run)
- OR Node.js (v18+) and a local PostgreSQL instance

## How to Run (Docker)

This is the recommended way to run the application, as it automatically sets up the Node.js application and the PostgreSQL database with the required schema and initial seed data.

1. Open a terminal in the root directory.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. The API will be available at `http://localhost:3000`.

## How to Run (Locally without Docker)

1. Ensure PostgreSQL is running.
2. Create a database named `library_db` and run the `init.sql` script to create tables.
3. Install dependencies: `npm install`
4. Start the server: `npm run dev`

## API Documentation

**Base URL**: `http://localhost:3000/api`

**Authentication**: All endpoints require Basic Authentication. 
- **Username**: admin
- **Password**: password

### Books (`/api/books`)
- `GET /` - List all books (Supports `?search=term`)
- `GET /:id` - Get a book by ID
- `POST /` - Add a new book
- `PATCH /:id` - Update a book
- `DELETE /:id` - Delete a book

### Borrowers (`/api/borrowers`)
- `GET /` - List all borrowers
- `GET /:id` - Get a borrower by ID
- `POST /` - Register a borrower
- `PATCH /:id` - Update a borrower
- `DELETE /:id` - Delete a borrower

### Borrowing Process (`/api/borrowing`)
- `POST /checkout` - Checkout a book (Requires `{ book_id, borrower_id, due_date }`) *(Rate Limited)*
- `POST /return` - Return a book (Requires `{ book_id, borrower_id }`) *(Rate Limited)*
- `GET /borrower/:borrowerId` - List currently checked-out books for a borrower
- `GET /overdue` - List all overdue books

### Reports (`/api/reports`)
- `GET /export-period?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Download CSV of borrows in period
- `GET /export-overdue-last-month` - Download CSV of overdue books from the last month
- `GET /export-borrowing-last-month` - Download CSV of all borrows from the last month

## Running Unit Tests

Unit tests are written using `Jest` and `Supertest`. They mock the repository layer, so no database connection is required to run them.

```bash
npm test
```
