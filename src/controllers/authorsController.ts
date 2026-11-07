
import type { Request, Response } from "express";

import {
  createAuthor as insertAuthor,
  createAuthorWithBooks as insertAuthorWithBooks,
  deleteAuthor as removeAuthor,
  getAuthorById as findAuthor,
  getAuthors as findAuthors,
  getAuthorsWithBooks as findAuthorsWithBooks,
  updateAuthor as saveAuthor,
  type AuthorFilters,
} from "../models/authorsModel.js";

// GET /api/authors
export async function getAuthors(req: Request, res: Response) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const filters: AuthorFilters = {
      page,
      limit,
      ...(typeof req.query.search === "string" && {
        search: req.query.search.trim(),
      }),
      ...(typeof req.query.nationality === "string" && {
        nationality: req.query.nationality.trim(),
      }),
    };

    const authors = await findAuthors(filters);

    return res.status(200).json(authors);
  } catch (error) {
    console.error("[GET /api/authors]", error);

    return res.status(500).json({
      error: "Error al obtener los autores",
    });
  }
}

// GET /api/authors/with-books
export async function getAuthorsWithBooks(
  _req: Request,
  res: Response,
) {
  try {
    const authors = await findAuthorsWithBooks();

    return res.status(200).json(authors);
  } catch (error) {
    console.error("[GET /api/authors/with-books]", error);

    return res.status(500).json({
      error: "Error al obtener autores y libros",
    });
  }
}

// GET /api/authors/:id
export async function getAuthorById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const author = await findAuthor(id);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error("[GET /api/authors/:id]", error);

    return res.status(500).json({
      error: "Error al obtener el autor",
    });
  }
}

// POST /api/authors
export async function createAuthor(req: Request, res: Response) {
  try {
    const author = await insertAuthor(req.body);

    return res.status(201).json({
      message: "Autor creado correctamente",
      data: author,
    });
  } catch (error) {
    console.error("[POST /api/authors]", error);

    return res.status(500).json({
      error: "Error al crear el autor",
    });
  }
}

// POST /api/authors/with-books
export async function createAuthorWithBooks(
  req: Request,
  res: Response,
) {
  try {
    const { book_ids, ...authorData } = req.body;

    const author = await insertAuthorWithBooks(
      authorData,
      book_ids,
    );

    return res.status(201).json({
      message: "Autor creado y libros asociados correctamente",
      data: author,
    });
  } catch (error) {
    console.error("[POST /api/authors/with-books]", error);

    if (
      error instanceof Error &&
      error.message === "Uno o más libros no existen"
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Error al crear el autor y asociar sus libros",
    });
  }
}

// PUT /api/authors/:id
export async function updateAuthor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const author = await saveAuthor(id, req.body);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    return res.status(200).json({
      message: "Autor actualizado correctamente",
      data: author,
    });
  } catch (error) {
    console.error("[PUT /api/authors/:id]", error);

    return res.status(500).json({
      error: "Error al actualizar el autor",
    });
  }
}

// DELETE /api/authors/:id
export async function deleteAuthor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const author = await removeAuthor(id);

    if (!author) {
      return res.status(404).json({
        error: "Autor no encontrado",
      });
    }

    return res.status(200).json({
      message: "Autor eliminado correctamente",
      data: author,
    });
  } catch (error) {
    console.error("[DELETE /api/authors/:id]", error);

    return res.status(500).json({
      error: "Error al eliminar el autor",
    });
  }
}
