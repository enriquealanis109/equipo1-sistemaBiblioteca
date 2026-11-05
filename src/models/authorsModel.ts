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

export interface AuthorListFilters {
  page: number;
  limit: number;
  search?: string | undefined;
  nationality?: string | undefined;
}

export interface AuthorsPage {
  authors: Author[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const authorColumns = "id, name, birth_date, nationality, created_at";

export async function getAuthors(
  filters: AuthorListFilters,
): Promise<AuthorsPage> {
  const filterValues = [filters.search ?? null, filters.nationality ?? null];
  const offset = (filters.page - 1) * filters.limit;
  const [countResult, authorsResult] = await Promise.all([
    pool.query<{ total: string }>(
      `SELECT COUNT(*)::text AS total
       FROM authors
       WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR nationality ILIKE '%' || $2 || '%')`,
      filterValues,
    ),
    pool.query<Author>(
      `SELECT ${authorColumns}
       FROM authors
       WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR nationality ILIKE '%' || $2 || '%')
       ORDER BY id
       LIMIT $3 OFFSET $4`,
      [...filterValues, filters.limit, offset],
    ),
  ]);
  const count = countResult.rows[0];
  if (!count) {
    throw new Error("No se recibió el conteo de autores desde la base de datos");
  }

  const total = Number(count.total);
  return {
    authors: authorsResult.rows,
    total,
    page: filters.page,
    limit: filters.limit,
    totalPages: Math.ceil(total / filters.limit),
  };
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
