import type { Request, Response } from "express";
import { UserModel } from "../models/userModel.js";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await UserModel.findAll();
    res.status(200).json({
      ok: true,
      mensaje: "Lista de usuarios",
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("[GET /users]", error);
    res
      .status(503)
      .json({ ok: false, mensaje: "Servicio temporalmente no disponible" });
  }
}

export async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id debe ser un número" });
  }

  try {
    const usuario = await UserModel.findById(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `El usuario con el id ${id} no existe!!!`,
      });
    }
    res
      .status(200)
      .json({ ok: true, mensaje: "Usuario encontrado", data: usuario });
  } catch (error) {
    console.error("[GET /users/:id]", error);
    res
      .status(503)
      .json({ ok: false, mensaje: "Servicio temporalmente no disponible" });
  }
}

export async function createUser(req: Request, res: Response) {
  const { name, email, role, phone } = req.body;

  try {
    const usuario = await UserModel.create(name, email, role, phone ?? null);
    res.status(201).json({
      ok: true,
      mensaje: `El usuario ${name} fue registrado con éxito!!`,
      data: usuario,
    });
  } catch (error) {
    const pgError = error as any;
    if (pgError.code === "23505") {
      return res
        .status(409)
        .json({ ok: false, mensaje: "El email ya está registrado" });
    }
    console.error("[POST /users]", error);
    res
      .status(503)
      .json({ ok: false, mensaje: "Servicio temporalmente no disponible" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id debe ser un número" });
  }
  const { name, email, role, phone } = req.body;

  try {
    const usuario = await UserModel.update(
      id,
      name,
      email,
      role,
      phone ?? null,
    );
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `El usuario con el id ${id} no existe!!!`,
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: `El usuario ${name} fue actualizado con éxito!!`,
      data: usuario,
    });
  } catch (error) {
    const pgError = error as any;
    if (pgError.code === "23505") {
      return res
        .status(409)
        .json({ ok: false, mensaje: "El email ya está registrado" });
    }
    console.error("[PUT /users/:id]", error);
    res
      .status(503)
      .json({ ok: false, mensaje: "Servicio temporalmente no disponible" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id debe ser un número" });
  }

  try {
    const usuario = await UserModel.remove(id);
    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `El usuario con el id ${id} no existe!!!`,
      });
    }
    res.status(200).json({
      ok: true,
      mensaje: "El usuario fue eliminado con éxito!!",
      data: usuario,
    });
  } catch (error) {
    const pgError = error as any;
    if (pgError.code === "23503") {
      return res.status(409).json({
        ok: false,
        mensaje: "No se puede eliminar: el usuario tiene préstamos registrados",
      });
    }
    console.error("[DELETE /users/:id]", error);
    res
      .status(503)
      .json({ ok: false, mensaje: "Servicio temporalmente no disponible" });
  }
}
