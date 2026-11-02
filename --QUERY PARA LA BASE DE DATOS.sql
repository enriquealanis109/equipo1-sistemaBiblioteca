--QUERY PARA LA BASE DE DATOS






CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    year INTEGER,
    category VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE books_authors (
    PRIMARY KEY (book_id, author_id),
    book_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);