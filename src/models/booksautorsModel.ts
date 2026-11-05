import { pool } from "../config/db.js";
export interface BookAuthor {
  book_id: number;
  author_id: number;
}

export const BooksAuthorsModel = {
  async findAll(filters: {
    bookId?: number | undefined;
    authorId?: number | undefined;
  }): Promise<BookAuthor[]> {
    let sqlBase = "SELECT * FROM books_authors WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    if (filters.bookId) {
      sqlBase += ` AND book_id = $${paramIndex}`;
      values.push(filters.bookId);
      paramIndex++;
    }
    if (filters.authorId) {
      sqlBase += ` AND author_id = $${paramIndex}`;
      values.push(filters.authorId);
      paramIndex++;
    }
    sqlBase += " ORDER BY id ASC";
  
    const { rows } = await pool.query(sqlBase, values);
    return rows;
  }
};

export async function getBooksAuthors(): Promise<BookAuthor[]> {
  const result = await pool.query<BookAuthor>(
    `SELECT book_id, author_id FROM books_authors ORDER BY book_id, author_id`,
  );
  return result.rows;
}

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

export async function getAuthorsByBook(bookId: number): Promise<BookAuthor[]> {
  const result = await pool.query<BookAuthor>(
    `SELECT a.id, a.name, a.birth_date, a.nationality
     FROM authors a
     INNER JOIN books_authors ba ON ba.author_id = a.id
     WHERE ba.book_id = $1
     ORDER BY a.name`,
    [bookId],
  );
  return result.rows;
}

export async function getBooksByAuthor(authorId: number): Promise<BookAuthor[]> {
  const result = await pool.query<BookAuthor>(
    `SELECT b.id, b.title, b.publisher, b.year, b.category
     FROM books b
     INNER JOIN books_authors ba ON ba.book_id = b.id
     WHERE ba.author_id = $1
     ORDER BY b.title`,
    [authorId],
  );
  return result.rows;
}