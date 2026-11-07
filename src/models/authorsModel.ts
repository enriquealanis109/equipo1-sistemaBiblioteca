
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

export interface AuthorFilters {
  page: number;
  limit: number;
  search?: string;
  nationality?: string;
}

export interface PaginatedAuthors {
  data: Author[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthorWithBooks extends Author {
  books: {
    id: number;
    title: string;
  }[];
}

const authorColumns = "id, name, birth_date, nationality, created_at";

// GET: obtener autores con filtros y paginación
export async function getAuthors(
  filters: AuthorFilters,
): Promise<PaginatedAuthors> {
  const { page, limit, search, nationality } = filters;

  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  if (nationality) {
    values.push(nationality);
    conditions.push(`nationality ILIKE $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const countResult = await pool.query<{ total: string }>(
    `SELECT COUNT(*) AS total FROM authors ${whereClause}`,
    values,
  );

  const total = Number(countResult.rows[0]?.total ?? 0);
  const offset = (page - 1) * limit;
  const dataValues = [...values, limit, offset];

  const result = await pool.query<Author>(
    `SELECT ${authorColumns}
     FROM authors
     ${whereClause}
     ORDER BY id
     LIMIT $${values.length + 1}
     OFFSET $${values.length + 2}`,
    dataValues,
  );

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// GET: obtener autor por ID
export async function getAuthorById(
  id: number,
): Promise<Author | undefined> {
  const result = await pool.query<Author>(
    `SELECT ${authorColumns} FROM authors WHERE id = $1`,
    [id],
  );

  return result.rows[0];
}

// POST: crear autor
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

// PUT: actualizar autor
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

// DELETE: eliminar autor
export async function deleteAuthor(
  id: number,
): Promise<Author | undefined> {
  const result = await pool.query<Author>(
    `DELETE FROM authors
     WHERE id = $1
     RETURNING ${authorColumns}`,
    [id],
  );

  return result.rows[0];
}

// GET: obtener autores con sus libros asociados
export async function getAuthorsWithBooks(): Promise<AuthorWithBooks[]> {
  const result = await pool.query<AuthorWithBooks>(
    `SELECT
       a.id,
       a.name,
       a.birth_date,
       a.nationality,
       a.created_at,
       COALESCE(
         json_agg(
           json_build_object(
             'id', b.id,
             'title', b.title
           )
         ) FILTER (WHERE b.id IS NOT NULL),
         '[]'
       ) AS books
     FROM authors a
     LEFT JOIN books_authors ba ON a.id = ba.author_id
     LEFT JOIN books b ON ba.book_id = b.id
     GROUP BY a.id
     ORDER BY a.id`,
  );

  return result.rows;
}

// POST: crear autor y asociar libros mediante una transacción
export async function createAuthorWithBooks(
  data: AuthorData,
  bookIds: number[],
): Promise<AuthorWithBooks> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Verificar que todos los libros existan
    if (bookIds.length > 0) {
      const booksResult = await client.query<{ id: number }>(
        `SELECT id FROM books WHERE id = ANY($1::int[])`,
        [bookIds],
      );

      if (booksResult.rows.length !== bookIds.length) {
        throw new Error("Uno o más libros no existen");
      }
    }

    // 2. Crear el autor
    const authorResult = await client.query<Author>(
      `INSERT INTO authors (name, birth_date, nationality)
       VALUES ($1, $2, $3)
       RETURNING ${authorColumns}`,
      [data.name, data.birth_date, data.nationality],
    );

    const author = authorResult.rows[0];

    if (!author) {
      throw new Error("No se pudo crear el autor");
    }

    // 3. Asociar los libros
    for (const bookId of bookIds) {
      await client.query(
        `INSERT INTO books_authors (book_id, author_id)
         VALUES ($1, $2)`,
        [bookId, author.id],
      );
    }

    // 4. Consultar los libros asociados
    const associatedBooks = await client.query<{
      id: number;
      title: string;
    }>(
      `SELECT id, title
       FROM books
       WHERE id = ANY($1::int[])
       ORDER BY id`,
      [bookIds],
    );

    // 5. Confirmar la transacción
    await client.query("COMMIT");

    return {
      ...author,
      books: associatedBooks.rows,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
