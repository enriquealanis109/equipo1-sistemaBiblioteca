import { query } from "../config/db.js";

export async function getAllBooks() {
  const queryText = "SELECT * FROM books ORDER BY id ASC";
  return query(queryText);
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
