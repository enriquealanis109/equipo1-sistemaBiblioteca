import { Router } from "express";
import {
  getBooksAuthors,
  createBooksAuthors,
  deleteBooksAuthors,
  getAuthorsByBook,
  getBooksByAuthor,
} from "../controllers/controllers.booksauthors.js";
import {
  validateBooksAuthors,
  validateBooksAuthorsParams,
} from "../middlewares/middlewares.booksauthors.js";

const router = Router();

router.get("/booksauthors", getBooksAuthors);
router.post("/booksauthors", validateBooksAuthors, createBooksAuthors);
router.delete(
  "/booksauthors/:book_id/:author_id",
  validateBooksAuthorsParams,
  deleteBooksAuthors,
);

// Consultas de la relacion muchos a muchos
router.get("/books/:id/authors", getAuthorsByBook);
router.get("/authors/:id/books", getBooksByAuthor);

export default router;
