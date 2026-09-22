# Bookstore-API Library Management System

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)
![Tests](https://img.shields.io/badge/tests-24%20passed-success.svg)

A comprehensive, enterprise-grade RESTful API for a Library Management System built with Node.js, Express, and PostgreSQL. This project is architected using **Clean Architecture** principles (Routes ➔ Controllers ➔ Services ➔ Repositories) and demonstrates advanced backend concepts including concurrency management, secure authentication, and data pagination.

## 🚀 Key Features & Engineering Highlights

- **JWT Authentication & Authorization**: Secure, stateless authentication replacing legacy basic-auth.
- **Race Condition Mitigation**: Utilizes PostgreSQL row-level locking (`FOR UPDATE`) and database-level unique constraints to prevent "Double Checkout" and "Lost Update" concurrency issues.
- **Database Migrations**: Version-controlled database schema management using `node-pg-migrate`.
- **Interactive Documentation**: Beautiful, auto-generated OpenAPI (Swagger) UI available at `/api-docs`.
- **Data Pagination**: SQL-level `LIMIT` and `OFFSET` pagination on listing endpoints to handle large datasets efficiently.
- **Analytics & CSV Exports**: Complex SQL aggregations parsed directly into downloadable CSV reports for business intelligence.
- **Centralized Error Handling**: Custom Error classes (`AppError`, `ConflictError`, `BadRequestError`) automatically caught and formatted by a global error middleware.
- **Rate Limiting**: Express-rate-limit applied to sensitive endpoints (Checkout/Return) to prevent brute-force attacks.

## 🛠 Tech Stack
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL
- **Migrations**: `node-pg-migrate`
- **Validation**: Joi
- **Documentation**: Swagger UI (`swagger-ui-express`, `yamljs`)
- **Testing**: Jest & Supertest

## 🐳 Quick Start (Docker)

This is the recommended way to run the application. Docker will automatically provision the PostgreSQL database, run the database migrations, and start the Node.js server.

1. Clone the repository and navigate into the root directory.
2. Ensure Docker Desktop is running.
3. Start the application:
   ```bash
   docker-compose up --build
   ```
4. Explore the interactive API documentation:
   👉 **http://localhost:3000/api-docs**

## 💻 Local Setup (Without Docker)

1. Ensure PostgreSQL is running locally on port `5432`.
2. Copy the environment file and fill in your local database credentials:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the database migrations to build the tables:
   ```bash
   npm run migrate up
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing

The project includes a robust suite of **24 Integration Tests** covering all core modules (Auth, Books, Borrowers, Borrowing, Reports). The tests mock the database layer to ensure fast, reliable execution without requiring a live database connection.

```bash
npm test
```

## 📚 API Endpoints Summary

*Note: View the complete, interactive documentation at `/api-docs` after starting the server.*

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Books**: `GET /api/books` (Paginated), `POST /api/books`, `PATCH /api/books/:id`, `DELETE /api/books/:id`
- **Borrowers**: `GET /api/borrowers` (Paginated), `POST /api/borrowers`, `PATCH /api/borrowers/:id`, `DELETE /api/borrowers/:id`
- **Borrowing**: `POST /api/borrowing/checkout`, `POST /api/borrowing/return`, `GET /api/borrowing/overdue`
- **Reports**: `GET /api/reports/export-period`, `GET /api/reports/export-overdue-last-month`
