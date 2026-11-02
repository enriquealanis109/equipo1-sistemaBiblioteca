import type { Request, Response } from "express";
import { query } from "../config/db.js";

export async function getUsers(req: Request, res: Response) {
  try {
    const resultado = await query(
      "SELECT id, name, email, role, phone, created_at FROM users ORDER BY id",
    );
    res.status(200).json({
      ok: true,
      mensaje: "Lista de usuarios",
      total: resultado.rowCount,
      data: resultado.rows,
    });
  } catch (error) {
    console.error("[GET /users]", error);
    res
      .status(503)
      .json({ ok: false, mensaje: "Servicio temporalmente no disponible" });
  }
}

export async function getUserById(req: Request, res: Response) {
  const idBuscando = Number(req.params.id);

  if (isNaN(idBuscando)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id debe ser un número" });
  }

  try {
    const resultado = await query(
      "SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1",
      [idBuscando],
    );
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `El usuario con el id ${idBuscando} no existe!!!`,
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
    const resultado = await query(
      `INSERT INTO users (name, email, role, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, phone, created_at`,
      [name, email, role, phone ?? null],
    );
    res.status(201).json({
      ok: true,
      mensaje: `El usuario ${name} fue registrado con éxito!!`,
      data: resultado.rows[0],
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
  const idBuscando = Number(req.params.id);

  if (isNaN(idBuscando)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id debe ser un número" });
  }

  const { name, email, role, phone } = req.body;

  try {
    const resultado = await query(
      `UPDATE users
       SET name = $1, email = $2, role = $3, phone = $4
       WHERE id = $5
       RETURNING id, name, email, role, phone, created_at`,
      [name, email, role, phone ?? null, idBuscando],
    );
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `El usuario con el id ${idBuscando} no existe!!!`,
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
  const idBuscando = Number(req.params.id);

  if (isNaN(idBuscando)) {
    return res
      .status(400)
      .json({ ok: false, mensaje: "El id debe ser un número" });
  }

  try {
    const resultado = await query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
      [idBuscando],
    );
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        mensaje: `El usuario con el id ${idBuscando} no existe!!!`,
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
