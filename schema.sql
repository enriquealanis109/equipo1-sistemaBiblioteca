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