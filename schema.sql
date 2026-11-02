--QUERY PARA LA BASE DE DATOS 

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    role VARCHAR (20) NOT NULL CHECK( ROLE IN ('estudiante','docente')),
    phone VARCHAR (20),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE loans(
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    loan_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP NOT NULL,
    status BOOLEAN NOT DEFAULT TRUE NULL,

    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
)
CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
