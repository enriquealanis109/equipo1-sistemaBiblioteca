import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/booksControllers.js";
import { validateBookData } from "../middlewares/booksMiddlewares.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);
router.post("/books", validateBookData, createBook);
router.put("/books/:id", validateBookData, updateBook);
router.delete("/books/:id", deleteBook);

export default router;
