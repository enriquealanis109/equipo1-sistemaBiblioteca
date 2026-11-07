import { Router } from "express";

import {
  createAuthor,
  createAuthorWithBooks,
  deleteAuthor,
  getAuthorById,
  getAuthors,
  getAuthorsWithBooks,
  updateAuthor,
} from "../controllers/authorsController.js";

import {
  validateAuthorData,
  validateAuthorId,
  validateAuthorWithBooks,
} from "../middlewares/authorsMiddleware.js";

const router = Router();

// Consultas
router.get("/with-books", getAuthorsWithBooks);
router.get("/", getAuthors);
router.get("/:id", validateAuthorId, getAuthorById);

// Creación
router.post(
  "/with-books",
  validateAuthorWithBooks,
  createAuthorWithBooks,
);

router.post("/", validateAuthorData, createAuthor);

// Actualización y eliminación
router.put("/:id", validateAuthorId, validateAuthorData, updateAuthor);
router.delete("/:id", validateAuthorId, deleteAuthor);

export default router;