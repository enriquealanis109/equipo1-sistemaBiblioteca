import { Request, Response, NextFunction } from "express";

export function validateBookData(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title, publisher, year, category, description } = req.body;
  if (
    !title ||
    !publisher ||
    !category ||
    title.trim() === "" ||
    publisher.trim() === "" ||
    category.trim() === ""
  ) {
    res.status(400).json({
      ok: false,
      error: "El TITULO, AUTOR y CATEGORIA son obligatorios",
    });
    return;
  } else if (
    typeof title !== "string" ||
    typeof publisher !== "string" ||
    typeof category !== "string"
  ) {
    res.status(400).json({
      ok: false,
      error: "El TITULO, AUTOR, y CATEGORIA deben ser cadenas de texto.",
    });
    return;
  }
  
  if (year !== undefined || year !== null) {
    if (year < 0 || !Number.isInteger(year) || typeof year !== "number") {
      res.status(400).json({
        ok: false,
        error: "El AÑO debe ser un número entero positivo si se proporciona.",
      });
      return;
    }
  }
  
  if (description !== null || description !== undefined) {
    if (description.trim() === "" || typeof description !== "string") {
      res.status(400).json({
        ok: false,
        error:
          "La DESCRIPCION debe ser un texto y no puede estar vacía si se proporciona.",
      });
      return;
    }
  }
  next();
}
