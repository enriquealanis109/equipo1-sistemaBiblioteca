import { Router } from "express";
import {
  createAuthor,
  deleteAuthor,
  getAuthorById,
  getAuthors,
  updateAuthor,
} from "../controllers/authorsController.js";
import {
  validateAuthorData,
  validateAuthorId,
  validateAuthorListQuery,
} from "../middlewares/authorsMiddleware.js";

const router = Router();

router.get("/", validateAuthorListQuery, getAuthors);
router.get("/:id", validateAuthorId, getAuthorById);
router.post("/", validateAuthorData, createAuthor);
router.put("/:id", validateAuthorId, validateAuthorData, updateAuthor);
router.delete("/:id", validateAuthorId, deleteAuthor);

export default router;
