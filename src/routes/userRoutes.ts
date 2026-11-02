import { Router } from "express";
import { validarUsuario } from "../middlewares/validarUsuario.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router: Router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", validarUsuario, createUser);
router.put("/:id", validarUsuario, updateUser);
router.delete("/:id", deleteUser);

export default router;
