import { Request, Response, NextFunction } from "express";

export const validateBooksAuthors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { book_id, author_id } = req.body;
  if (!book_id || !author_id) {
    return res.status(400).json({ message: "Faltan datos" });
  }
  next();
};
