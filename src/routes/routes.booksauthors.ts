import { Router } from "express";
import { getBooksAuthors, createBooksAuthors } from "../controllers/controllers.booksauthors.js";

const router = Router();

router.get("/booksauthors", getBooksAuthors);
router.post("/booksauthors", createBooksAuthors);

export default router;