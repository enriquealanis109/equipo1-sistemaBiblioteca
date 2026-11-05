import type { Request, Response, NextFunction } from "express";
import { createBooksAuthorSchema } from "../schemas/booksauthorsSchemas.js";

const bookAuthorSchema = createBooksAuthorSchema.pick({
  book_id: true,
  author_id: true,
});

export const validateBooksAuthors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = bookAuthorSchema.safeParse(req.body ?? {});
  if (!result.success) {
    return res.status(400).json({
      ok: false,
      error: "Datos invalidos",
      detalles: result.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }
  req.body = result.data; // ya convertidos a number
  next();
};

export const validateBooksAuthorsParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = bookAuthorSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      ok: false,
      error: "Parametros invalidos",
      detalles: result.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }
  next();
};
