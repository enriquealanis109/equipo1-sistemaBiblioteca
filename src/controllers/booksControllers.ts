import { Request, Response } from "express";
import { query } from "../config/db.js";

export async function getBooks(req: Request, res: Response) {
  try {
    const queryResult = await query("SELECT * FROM books");
    res.json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
}

export async function getBookById(req: Request, res: Response) {
  const { id } = req.params;
  const queryText = "SELECT * FROM books WHERE id = $1";
  try {
    const queryResult = await query(queryText, [id]);
    if (queryResult.rowCount === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json(queryResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el libro" });
  }
}

export async function createBook(req: Request, res: Response) {
  const { title, publisher, year, category, description } = req.body;
  try {
    const queryText =
      "INSERT INTO books (title, publisher, year, category, description) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [title, publisher, year !== undefined ? year : null, category, description !== undefined ? description : null];
    const queryResult = await query(queryText, values);
    res.status(201).json({message: "Libro creado exitosamente", book: queryResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
}

export async function updateBook(req: Request, res: Response) { 
  const { id } = req.params;
  const { title, publisher, year, category, description } = req.body;
  try {
    const queryText =
      "UPDATE books SET title = $1, publisher = $2, year = $3, category = $4, description = $5 WHERE id = $6 RETURNING *";
    const values = [title, publisher, year, category, description, id];
    const queryResult = await query(queryText, values);
    if (queryResult.rowCount === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json({message: "Libro actualizado exitosamente", book: queryResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el libro" });
  }
}

export async function deleteBook(req: Request, res: Response) { 
  const { id } = req.params;
  try {
    const queryText = "DELETE FROM books WHERE id = $1 RETURNING *";
    const queryResult = await query(queryText, [id]);
    if (queryResult.rowCount === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json({message: "Libro eliminado exitosamente", book: queryResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el libro" });
  }
}