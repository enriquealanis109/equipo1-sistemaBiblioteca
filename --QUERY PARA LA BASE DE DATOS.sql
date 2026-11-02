--QUERY PARA LA BASE DE DATOS






CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    year INTEGER,
    category VARCHAR(100) NOT NULL,
    description TEXT
);