import { query } from "../config/db.js";

export async function getAllBooks(filters: {
  title?: string | undefined;
  publisher?: string | undefined;
  category?: string | undefined;
  limit?: number | undefined;
}) {
  let sqlText = "SELECT * FROM books WHERE 1=1";
  let paramIndex = 1;
  const values: any[] = [];

  if (filters.title) {
    sqlText += ` AND title ILIKE $${paramIndex}`;
    values.push(`%${filters.title}%`);
    paramIndex++;
  }
  if (filters.publisher) {
    sqlText += ` AND publisher ILIKE $${paramIndex}`;
    values.push(`%${filters.publisher}%`);
    paramIndex++;
  }
  if (filters.category) {
    sqlText += ` AND category ILIKE $${paramIndex}`;
    values.push(`%${filters.category}%`);
    paramIndex++;
  }

  sqlText += ` ORDER BY id ASC`;

  if (filters.limit) {
    sqlText += ` LIMIT $${paramIndex}`;
    values.push(Number(filters.limit));
    paramIndex++;
  }

  const { rows }= await query(sqlText, values);
  return rows;
}

export async function bookById(id: number) {
  const queryText = "SELECT * FROM books WHERE id = $1";
  return query(queryText, [id]);
}

export async function createsBook(
  title: string,
  publisher: string,
  year: number | null,
  category: string,
  description: string | null,
) {
  const queryText =
    "INSERT INTO books (title, publisher, year, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [
    title,
    publisher,
    year !== undefined ? year : null,
    category,
    description !== undefined ? description : null,
  ];
  return query(queryText, values);
}

export async function updatesBook(
  id: number,
  title: string,
  publisher: string,
  year: number | null,
  category: string,
  description: string | null,
) {
  const queryText =
    "UPDATE books SET title = $2, publisher = $3, year = $4, category = $5, description = $6 WHERE id = $1 RETURNING *";
  const values = [id, title, publisher, year, category, description];
  return query(queryText, values);
}

export async function deletesBook(id: number) {
  const queryText = "DELETE FROM books WHERE id = $1 RETURNING *";
  return query(queryText, [id]);
}
