import { Router } from "express";
import {
  getBooksAuthorsById,
  createBooksAuthors,
  deleteBooksAuthors,
  getAuthorsByBook,
  getBooksByAuthor,
} from "../controllers/controllers.booksauthors.js";
import {
  validateBooksAuthors,
  validateBooksAuthorsParams,
} from "../middlewares/middlewares.booksauthors.js";

const router :Router = Router();

router.get("/booksauthors/:book_id/:author_id", getBooksAuthorsById);
router.post("/booksauthors", validateBooksAuthors, createBooksAuthors);
router.delete(
  "/booksauthors/:book_id/:author_id",
  validateBooksAuthorsParams,
  deleteBooksAuthors,
);

router.get("/books/:id/authors", getAuthorsByBook);
router.get("/authors/:id/books", getBooksByAuthor);

export default router;
