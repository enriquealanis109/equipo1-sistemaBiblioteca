import type { Request, Response } from "express";
import {
  createAuthor as insertAuthor,
  deleteAuthor as removeAuthor,
  getAuthorById as findAuthor,
  getAuthors as findAuthors,
  updateAuthor as saveAuthor,
  type AuthorData,
} from "../models/authorsModel.js";

export async function getAuthors(_req: Request, res: Response) {
  try {
    const authors = await findAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error("[GET /api/authors]", error);
    return res.status(500).json({ error: "Error al obtener los autores" });
  }
}

export async function getAuthorById(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const author = await findAuthor(id);
    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error("[GET /api/authors/:id]", error);
    return res.status(500).json({ error: "Error al obtener el autor" });
  }
}

export async function createAuthor(req: Request, res: Response) {
  const data: AuthorData = {
    name: req.body.name,
    birth_date: req.body.birth_date,
    nationality: req.body.nationality,
  };
  try {
    const author = await insertAuthor(data);
    return res.status(201).json({
      message: "Autor creado exitosamente",
      author,
    });
  } catch (error) {
    console.error("[POST /api/authors]", error);
    return res.status(500).json({ error: "Error al crear el autor" });
  }
}

export async function updateAuthor(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data: AuthorData = {
    name: req.body.name,
    birth_date: req.body.birth_date,
    nationality: req.body.nationality,
  };
  try {
    const author = await saveAuthor(id, data);
    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    return res.status(200).json({
      message: "Autor actualizado exitosamente",
      author,
    });
  } catch (error) {
    console.error("[PUT /api/authors/:id]", error);
    return res.status(500).json({ error: "Error al actualizar el autor" });
  }
}

export async function deleteAuthor(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const author = await removeAuthor(id);
    if (!author) {
      return res.status(404).json({ error: "Autor no encontrado" });
    }
    return res.status(200).json({
      message: "Autor eliminado exitosamente",
      author,
    });
  } catch (error) {
    console.error("[DELETE /api/authors/:id]", error);
    return res.status(500).json({ error: "Error al eliminar el autor" });
  }
}
