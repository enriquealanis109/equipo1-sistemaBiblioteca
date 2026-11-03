import { pool } from "../config/db.js";

export interface Author {
  id: number;
  name: string;
  birth_date: string | null;
  nationality: string | null;
  created_at: Date;
}

export interface AuthorData {
  name: string;
  birth_date: string | null;
  nationality: string | null;
}

const authorColumns = "id, name, birth_date, nationality, created_at";

export async function getAuthors(): Promise<Author[]> {
  const result = await pool.query<Author>(
    `SELECT ${authorColumns} FROM authors ORDER BY id`,
  );
  return result.rows;
}

export async function getAuthorById(id: number): Promise<Author | undefined> {
  const result = await pool.query<Author>(
    `SELECT ${authorColumns} FROM authors WHERE id = $1`,
    [id],
  );
  return result.rows[0];
}

export async function createAuthor(data: AuthorData): Promise<Author> {
  const result = await pool.query<Author>(
    `INSERT INTO authors (name, birth_date, nationality)
     VALUES ($1, $2, $3)
     RETURNING ${authorColumns}`,
    [data.name, data.birth_date, data.nationality],
  );
  const author = result.rows[0];
  if (!author) {
    throw new Error("No se recibió el autor creado desde la base de datos");
  }
  return author;
}

export async function updateAuthor(
  id: number,
  data: AuthorData,
): Promise<Author | undefined> {
  const result = await pool.query<Author>(
    `UPDATE authors
     SET name = $1, birth_date = $2, nationality = $3
     WHERE id = $4
     RETURNING ${authorColumns}`,
    [data.name, data.birth_date, data.nationality, id],
  );
  return result.rows[0];
}

export async function deleteAuthor(id: number): Promise<Author | undefined> {
  const result = await pool.query<Author>(
    `DELETE FROM authors
     WHERE id = $1
     RETURNING ${authorColumns}`,
    [id],
  );
  return result.rows[0];
}
