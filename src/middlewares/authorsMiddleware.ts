
import type { NextFunction, Request, Response } from "express";
import {
  authorSchema,
  authorIdSchema,
  authorListQuerySchema,
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

export function validateAuthorId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = authorIdSchema.safeParse(req.params);

  if (!result.success) {
    res.status(400).json({
      error: "ID de autor inválido",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  next();
}

export function validateAuthorListQuery(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = authorListQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      error: "Parámetros de consulta inválidos",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Guardamos los parámetros validados y transformados por Zod.
  // El controlador utilizará estos datos sin volver a validarlos.
  res.locals.authorListQuery = result.data;

  next();
}
