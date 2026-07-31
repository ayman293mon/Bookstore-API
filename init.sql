-- 1. BOOKS TABLE
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    published_year INT,
    quantity INT NOT NULL DEFAULT 1,       
    available_quantity INT NOT NULL DEFAULT 1, 
    shelf_location VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_isbn ON books(isbn);

-- 2. BORROWERS TABLE
CREATE TABLE borrowers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    registered_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_borrowers_email ON borrowers(email);

-- 3. BORROW_RECORDS TABLE
CREATE TABLE borrow_records (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    borrower_id INT NOT NULL REFERENCES borrowers(id) ON DELETE RESTRICT,
    borrow_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'BORROWED' -- 'BORROWED', 'RETURNED'
);

CREATE INDEX idx_borrow_records_borrower ON borrow_records(borrower_id);
CREATE INDEX idx_borrow_records_book ON borrow_records(book_id);
CREATE INDEX idx_borrow_records_status ON borrow_records(status);


INSERT INTO books (isbn, title, author, published_year, quantity, available_quantity, shelf_location)
VALUES 
('9780743273565', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 5, 5, 'A1-Shelf1'),
('9780061120084', 'To Kill a Mockingbird', 'Harper Lee', 1960, 3, 3, 'A1-Shelf2');

INSERT INTO borrowers (email, name)
VALUES 
('john.doe@example.com', 'John Doe'),
('jane.smith@example.com', 'Jane Smith');
