import type { Response, Request } from "express";
import * as BooksAuthorsModel from "../models/booksautorsModel.js";

export async function getBooksAuthors(req: Request, res: Response) {
  try {
    const rows = await BooksAuthorsModel.getBooksAuthors();
    res.status(200).json({ ok: true, total: rows.length, data: rows });
  } catch (error) {
    console.error("[GET /booksauthors]", error);
    res.status(500).json({
      ok: false,
      error: "Error al obtener las relaciones libro-autor",
    });
  }
}

export async function createBooksAuthors(req: Request, res: Response) {
  const { book_id, author_id } = req.body;
  try {
    const relacion = await BooksAuthorsModel.createBooksAuthors({ book_id, author_id });
    res.status(201).json({
      ok: true,
      mensaje: "Relacion libro-autor creada con exito",
      data: relacion,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        ok: false,
        error: "Ese autor ya esta asignado a ese libro",
      });
    }
    if (error.code === "23503") {
      return res.status(404).json({
        ok: false,
        error: "El libro o el autor no existen",
      });
    }
    console.error("[POST /booksauthors]", error);
    res.status(500).json({
      ok: false,
      error: "Error al crear la relacion libro-autor",
      detalles: error.message,
    });
  }
}

export async function deleteBooksAuthor(req: Request, res: Response) {
  const bookId = Number(req.params.book_id);
  const authorId = Number(req.params.author_id);
  try {
    const relacion = await BooksAuthorsModel.deleteBooksAuthors(bookId, authorId);
    if (!relacion) {
      return res.status(404).json({
        ok: false,
        error: "La relacion libro-autor no existe",
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: "Relacion libro-autor eliminada con exito",
      data: relacion,
    });
  } catch (error) {
    console.error("[DELETE /booksauthors]", error);
    res.status(500).json({
      ok: false,
      error: "Error al eliminar la relacion libro-autor",
    });
  }
}

export async function getAuthorsByBooks(req: Request, res: Response) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId) || bookId <= 0) {
    return res.status(400).json({ ok: false, error: "El id debe ser un entero positivo" });
  }
  try {
    const autores = await BooksAuthorsModel.getAuthorsByBook(bookId);
    res.status(200).json({ ok: true, total: autores.length, data: autores });
  } catch (error) {
    console.error("[GET /books/:id/authors]", error);
    res.status(500).json({ ok: false, error: "Error al obtener los autores del libro" });
  }
}

export async function getBooksByAuthors(req: Request, res: Response) {
  const authorId = Number(req.params.id);
  if (!Number.isInteger(authorId) || authorId <= 0) {
    return res.status(400).json({ ok: false, error: "El id debe ser un entero positivo" });
  }
  try {
    const libros = await BooksAuthorsModel.getBooksByAuthor(authorId);
    res.status(200).json({ ok: true, total: libros.length, data: libros });
  } catch (error) {
    console.error("[GET /authors/:id/books]", error);
    res.status(500).json({ ok: false, error: "Error al obtener los libros del autor" });
  }
}


export async function deleteBooksAuthors(req: Request, res: Response) {
  const bookId = Number(req.params.book_id);
  const authorId = Number(req.params.author_id);
  try {
    const relacion = await BooksAuthorsModel.deleteBooksAuthors(bookId, authorId);
    if (!relacion) {
      return res.status(404).json({
        ok: false,
        error: "La relacion libro-autor no existe",
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: "Relacion libro-autor eliminada con exito",
      data: relacion,
    });
  } catch (error) {
    console.error("[DELETE /booksauthors]", error);
    res.status(500).json({
      ok: false,
      error: "Error al eliminar la relacion libro-autor",
    });
  }
}

export async function getAuthorsByBook(req: Request, res: Response) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId) || bookId <= 0) {
    return res.status(400).json({ ok: false, error: "El id debe ser un entero positivo" });
  }
  try {
    const autores = await BooksAuthorsModel.getAuthorsByBook(bookId);
    res.status(200).json({ ok: true, total: autores.length, data: autores });
  } catch (error) {
    console.error("[GET /books/:id/authors]", error);
    res.status(500).json({ ok: false, error: "Error al obtener los autores del libro" });
  }
}

export async function getBooksByAuthor(req: Request, res: Response) {
  const authorId = Number(req.params.id);
  if (!Number.isInteger(authorId) || authorId <= 0) {
    return res.status(400).json({ ok: false, error: "El id debe ser un entero positivo" });
  }
  try {
    const libros = await BooksAuthorsModel.getBooksByAuthor(authorId);
    res.status(200).json({ ok: true, total: libros.length, data: libros });
  } catch (error) {
    console.error("[GET /authors/:id/books]", error);
    res.status(500).json({ ok: false, error: "Error al obtener los libros del autor" });
  }
}