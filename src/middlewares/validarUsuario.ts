import type { Request, Response, NextFunction } from "express";

export const validarUsuario = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, email, role } = req.body;

  if (!name) {
    res.status(400).json({ ok: false, mensaje: "El nombre es obligatorio" });
    return;
  }
  if (!email) {
    res.status(400).json({ ok: false, mensaje: "El email es obligatorio" });
    return;
  }
  if (role !== "estudiante" && role !== "docente") {
    res
      .status(400)
      .json({ ok: false, mensaje: "El rol debe ser estudiante o docente" });
    return;
  }
  next();
};
