import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { validateBookData } from "../middlewares/booksMiddlewares.js";
import { bookSchema, bookUpdateSchema } from "../schemas/bookSchema.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.post("/books", validateBookData(bookSchema), createBook);
router.put("/books/:id", validateBookData(bookUpdateSchema), updateBook);
router.delete("/books/:id", deleteBook);

export default router;
