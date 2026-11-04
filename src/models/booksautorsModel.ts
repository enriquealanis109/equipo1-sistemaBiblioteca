import { pool } from "../config/db.js";

// Tabla puente: llave primaria compuesta (book_id, author_id), no tiene columna id
export interface BookAuthor {
  book_id: number;
  author_id: number;
}

export interface AuthorOfBook {
  id: number;
  name: string;
  birth_date: string | null;
  nationality: string | null;
}

export interface BookOfAuthor {
  id: number;
  title: string;
  publisher: string;
  year: number | null;
  category: string;
}

const columns = "book_id, author_id";

export async function getBooksAuthors(): Promise<BookAuthor[]> {
  const result = await pool.query<BookAuthor>(
    `SELECT ${columns} FROM books_authors ORDER BY book_id, author_id`,
  );
  return result.rows;
}

export async function getBooksAuthorsById(
  bookId: number,
  authorId: number,
): Promise<BookAuthor | undefined> {
  const result = await pool.query<BookAuthor>(
    `SELECT ${columns} FROM books_authors
     WHERE book_id = $1 AND author_id = $2`,
    [bookId, authorId],
  );
  return result.rows[0];
}

export async function createBooksAuthors(data: BookAuthor): Promise<BookAuthor> {
  const result = await pool.query<BookAuthor>(
    `INSERT INTO books_authors (book_id, author_id)
     VALUES ($1, $2)
     RETURNING ${columns}`,
    [data.book_id, data.author_id],
  );
  const booksAuthors = result.rows[0];
  if (!booksAuthors) {
    throw new Error("No se recibio la relacion libro-autor creado desde la base de datos");
  }
  return booksAuthors;
}

export async function deleteBooksAuthors(
  bookId: number,
  authorId: number,
): Promise<BookAuthor | undefined> {
  const result = await pool.query<BookAuthor>(
    `DELETE FROM books_authors
     WHERE book_id = $1 AND author_id = $2
     RETURNING ${columns}`,
    [bookId, authorId],
  );
  return result.rows[0];
}

// Autores de un libro
export async function getAuthorsByBook(bookId: number): Promise<AuthorOfBook[]> {
  const result = await pool.query<AuthorOfBook>(
    `SELECT a.id, a.name, a.birth_date, a.nationality
     FROM authors a
     INNER JOIN books_authors ba ON ba.author_id = a.id
     WHERE ba.book_id = $1
     ORDER BY a.name`,
    [bookId],
  );
  return result.rows;
}

// Libros de un autor
export async function getBooksByAuthor(authorId: number): Promise<BookOfAuthor[]> {
  const result = await pool.query<BookOfAuthor>(
    `SELECT b.id, b.title, b.publisher, b.year, b.category
     FROM books b
     INNER JOIN books_authors ba ON ba.book_id = b.id
     WHERE ba.author_id = $1
     ORDER BY b.title`,
    [authorId],
  );
  return result.rows;
}
