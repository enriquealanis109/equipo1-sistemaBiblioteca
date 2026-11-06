import type { Response, Request } from "express";
import { z } from "zod";
import {
  BooksAuthorsModel,
  getBooksAuthorsById as getRelations,
  createBooksAuthors as createRelation,
  deleteBooksAuthors as deleteRelation,
  getAuthorsByBook as findAuthorsByBook,
  getBooksByAuthor as findBooksByAuthor,
} from "../models/booksautorsModel.js";
import {
  getBooksAuthorsQuerySchema,
  paginationQuerySchema,
} from "../schemas/booksauthorsSchemas.js";

export async function getBooksAuthorsById(req: Request, res: Response) {
  const parsed = getBooksAuthorsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Parámetros de consulta inválidos",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const { book_id, author_id, page, limit } = parsed.data;
  try {
    const result = await BooksAuthorsModel.findAll({
      bookId: book_id,
      authorId: author_id,
      page,
      limit,
    });
    res.status(200).json({
      ok: true,
      mensaje: "Lista de relaciones libro-autor",
      data: result.data,
      pagination: result.pagination,
    });
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
    const relacion = await createRelation({ book_id, author_id });
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

export async function deleteBooksAuthors(req: Request, res: Response) {
  const bookId = Number(req.params.book_id);
  const authorId = Number(req.params.author_id);
  try {
    const relacion = await deleteRelation(bookId, authorId);
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

// GET /books/:id/authors?page=&limit=
export async function getAuthorsByBook(req: Request, res: Response) {
  const bookId = Number(req.params.id);
  if (!Number.isInteger(bookId) || bookId <= 0) {
    return res.status(400).json({ ok: false, error: "El id debe ser un entero positivo" });
  }
  const parsed = paginationQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Parámetros de consulta inválidos",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const { page, limit } = parsed.data;
  try {
    const result = await findAuthorsByBook(bookId, page, limit);
    res.status(200).json({
      ok: true,
      data: result.data,
      pagination: result.pagination,
    });
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
  const parsed = paginationQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Parametros de consulta invalidos",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  const { page, limit } = parsed.data;
  try {
    const result = await findBooksByAuthor(authorId, page, limit);
    res.status(200).json({
      ok: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("[GET /authors/:id/books]", error);
    res.status(500).json({ ok: false, error: "Error al obtener los libros del autor" });
  }
}