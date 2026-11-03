import { Request, Response } from "express";
import { getAllBooks, bookById, createsBook, updatesBook, deletesBook } from "../models/booksModel.js";

export async function getBooks(req: Request, res: Response) {
  try {
    const books = await getAllBooks();
    res.json(books.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los libros" });
  }
}

export async function getBookById(req: Request, res: Response) {
  const id  = Number(req.params.id);
  try {
    const queryResult = await bookById(id);
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
    const queryResult = await createsBook(title, publisher, year, category, description);
    res.status(201).json({message: "Libro creado exitosamente", book: queryResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
}

export async function updateBook(req: Request, res: Response) { 
  const id = Number(req.params.id);
  const { title, publisher, year, category, description } = req.body;
  try {
    const queryResult = await updatesBook(id, title, publisher, year, category, description);
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
  const id = Number(req.params.id);
  try {
    const queryResult = await deletesBook(id);
    if (queryResult.rowCount === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }
    res.json({message: "Libro eliminado exitosamente", book: queryResult.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el libro" });
  }
}