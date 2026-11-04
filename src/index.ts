import type { Application, Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< Updated upstream
import booksRouter from "./routes/booksRoutes.js";
=======
import booksRouter from "./routes/bookRoutes.js";
import authorsRouter from "./routes/authorsRoutes.js";
>>>>>>> Stashed changes
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", booksRouter);
app.use("/api/users", userRoutes);

app.get("/", function (req: Request, res: Response) {
  res.json({
    mensaje: "API CON EXPRESS FUNCIONANDO AL 100%",
  });
});

app.listen(PORT, function () {
  console.log(`servidor corriendo en: http://localhost:${PORT}`);
});
