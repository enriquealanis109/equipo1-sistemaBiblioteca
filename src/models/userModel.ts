import { query } from "../config/db.js";

export const UserModel = {
  async findAll() {
    const { rows } = await query(
      "SELECT id. name, email,role,phone,created_at FROM users ORDER BY id",
    );
    return rows;
  },
  async findById(id: number) {
    const { rows } = await query(
      "SELECT id, name, email, role, phone, created_at FROM users WHERE id = $1",
      [id],
    );
    return rows[0];
  },

  async create(
    name: string,
    email: string,
    role: string,
    phone: string | null,
  ) {
    const { rows } = await query(
      `INSERT INTO users (name, email, role, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, phone, created_at`,
      [name, email, role, phone],
    );
    return rows[0];
  },

  async update(
    id: number,
    name: string,
    email: string,
    role: string,
    phone: string | null,
  ) {
    const { rows } = await query(
      `UPDATE users SET name = $1, email = $2, role = $3, phone = $4
       WHERE id = $5
       RETURNING id, name, email, role, phone, created_at`,
      [name, email, role, phone, id],
    );
    return rows[0];
  },

  async remove(id: number) {
    const { rows } = await query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
      [id],
    );
    return rows[0];
  },
};
