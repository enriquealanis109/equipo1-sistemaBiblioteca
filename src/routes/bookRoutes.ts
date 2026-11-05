import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { validateBookData } from "../middlewares/booksMiddlewares.js";
import { bookSchema, bookUpdateSchema, getBookInputSchema } from "../schemas/bookSchema.js";

const router = Router();

router.get("/books", validateBookData(getBookInputSchema, "query"), getBooks);
router.get("/books/:id", getBookById);
router.post("/books", validateBookData(bookSchema, "body"), createBook);
router.put("/books/:id", validateBookData(bookUpdateSchema, "body"), updateBook);
router.delete("/books/:id", deleteBook);

export default router;
