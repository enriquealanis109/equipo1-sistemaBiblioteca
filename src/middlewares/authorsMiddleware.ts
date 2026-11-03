import type { NextFunction, Request, Response } from "express";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

export function validateAuthorData(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({ error: "El cuerpo de la solicitud debe ser un objeto" });
    return;
  }

  const { name, birth_date, nationality } = req.body;

  if (typeof name !== "string" || name.trim().length === 0 || name.length > 150) {
    res.status(400).json({
      error: "El nombre es obligatorio y debe tener como máximo 150 caracteres",
    });
    return;
  }

  if (
    birth_date !== undefined &&
    birth_date !== null &&
    (typeof birth_date !== "string" || !isValidDate(birth_date))
  ) {
    res.status(400).json({
      error: "La fecha de nacimiento debe tener el formato YYYY-MM-DD",
    });
    return;
  }

  if (
    nationality !== undefined &&
    nationality !== null &&
    (typeof nationality !== "string" || nationality.length > 100)
  ) {
    res.status(400).json({
      error: "La nacionalidad debe ser texto de máximo 100 caracteres",
    });
    return;
  }

  req.body.name = name.trim();
  req.body.birth_date = birth_date ?? null;
  req.body.nationality = nationality ?? null;
  next();
}

export function validateAuthorId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "El id debe ser un entero positivo" });
    return;
  }
  next();
}
