import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import {
  createUserSchema,
  updateUserSchema,
  getUsersQuerySchema,
} from "../schemas/userSchema.js";

const router: Router = Router();

router.get("/", validateSchema(getUsersQuerySchema, "query"), getUsers);
router.get("/:id", getUserById);
router.post("/", validateSchema(createUserSchema), createUser);
router.put("/:id", validateSchema(updateUserSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
