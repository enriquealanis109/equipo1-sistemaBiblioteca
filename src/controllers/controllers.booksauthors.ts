import type { Response, Request } from "express";
import { query } from "../config/db.js";

export async function getBooksAuthors(req: Request, res: Response) {
  try {
    const { rows } = await query("SELECT * FROM books_authors ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obetener las relaciones libro-autor",
    });
  }
}

export async function createBooksAuthors(req: Request, res: Response) {
  const { book_id, author_id } = req.body;
  try {
    const text = `INSERT INTO books_authors(book_id, author_id) VALUES ($1,$2) RETURNING *`;
    const values = [book_id, author_id];
    const { rows } = await query(text, values);
    res.status(201).json({
      mensaje: "relacion libro-autor creada con exito",
      data: rows[0],
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear la relacion libro-autor",
      detalles: error.mesagge,
    });
  }
}