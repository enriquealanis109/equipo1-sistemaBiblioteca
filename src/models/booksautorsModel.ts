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

export interface Pagination {
  totalItem: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

function buildPagination(totalItem: number, page: number, limit: number): Pagination {
  return {
    totalItem,
    itemsPerPage: limit,
    currentPage: page,
    totalPages: Math.ceil(totalItem / limit),
  };
}

export const BooksAuthorsModel = {
  async findAll(filters: {
    bookId?: number | undefined;
    authorId?: number | undefined;
    page: number;
    limit: number;
  }): Promise<Paginated<BookAuthor>> {
    const { bookId, authorId, page, limit } = filters;
    let where = "WHERE 1=1";
    const values: number[] = [];
    let paramIndex = 1;

    if (bookId) {
      where += ` AND book_id = $${paramIndex}`;
      values.push(bookId);
      paramIndex++;
    }
    if (authorId) {
      where += ` AND author_id = $${paramIndex}`;
      values.push(authorId);
      paramIndex++;
    }

    const countResult = await pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM books_authors ${where}`,
      values,
    );
    const totalItem = Number(countResult.rows[0]?.count ?? 0);

    const offset = (page - 1) * limit;
    const { rows } = await pool.query<BookAuthor>(
      `SELECT book_id, author_id FROM books_authors ${where}
       ORDER BY book_id, author_id
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset],
    );

    return { data: rows, pagination: buildPagination(totalItem, page, limit) };
  },
};

export async function getBooksAuthorsById(
  bookId: number,
  authorId: number,
): Promise<BookAuthor | undefined> {
  const result = await pool.query<BookAuthor>(
    `SELECT book_id, author_id FROM books_authors
     WHERE book_id = $1 AND author_id = $2`,
    [bookId, authorId],
  );
  return result.rows[0];
}

export async function createBooksAuthors(data: BookAuthor): Promise<BookAuthor> {
  const result = await pool.query<BookAuthor>(
    `INSERT INTO books_authors (book_id, author_id)
     VALUES ($1, $2)
     RETURNING book_id, author_id`,
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
     RETURNING book_id, author_id`,
    [bookId, authorId],
  );
  return result.rows[0];
}

// Autores de un libro (paginado)
export async function getAuthorsByBook(
  bookId: number,
  page: number,
  limit: number,
): Promise<Paginated<AuthorOfBook>> {
  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM books_authors WHERE book_id = $1",
    [bookId],
  );
  const totalItem = Number(countResult.rows[0]?.count ?? 0);

  const offset = (page - 1) * limit;
  const { rows } = await pool.query<AuthorOfBook>(
    `SELECT a.id, a.name, a.birth_date, a.nationality
     FROM authors a
     INNER JOIN books_authors ba ON ba.author_id = a.id
     WHERE ba.book_id = $1
     ORDER BY a.name, a.id
     LIMIT $2 OFFSET $3`,
    [bookId, limit, offset],
  );

  return { data: rows, pagination: buildPagination(totalItem, page, limit) };
}

// Libros de un autor (paginado)
export async function getBooksByAuthor(
  authorId: number,
  page: number,
  limit: number,
): Promise<Paginated<BookOfAuthor>> {
  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM books_authors WHERE author_id = $1",
    [authorId],
  );
  const totalItem = Number(countResult.rows[0]?.count ?? 0);

  const offset = (page - 1) * limit;
  const { rows } = await pool.query<BookOfAuthor>(
    `SELECT b.id, b.title, b.publisher, b.year, b.category
     FROM books b
     INNER JOIN books_authors ba ON ba.book_id = b.id
     WHERE ba.author_id = $1
     ORDER BY b.title, b.id
     LIMIT $2 OFFSET $3`,
    [authorId, limit, offset],
  );

  return { data: rows, pagination: buildPagination(totalItem, page, limit) };
}