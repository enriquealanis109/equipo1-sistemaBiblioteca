import type { NextFunction, Request, Response } from "express";
import {
  authorSchema,
  authorWithBooksSchema,
} from "../schemas/authorsSchema.js";

export function validateAuthorData(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = authorSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Datos del autor inválidos",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  req.body = {
    name: result.data.name,
    birth_date: result.data.birth_date ?? null,
    nationality: result.data.nationality ?? null,
  };

  next();
}

export function validateAuthorWithBooks(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = authorWithBooksSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Datos del autor o libros inválidos",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  req.body = {
    name: result.data.name,
    birth_date: result.data.birth_date ?? null,
    nationality: result.data.nationality ?? null,
    book_ids: result.data.book_ids,
  };

  next();
}

export function validateAuthorId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      error: "El id debe ser un entero positivo",
    });
    return;
  }

  next();
}