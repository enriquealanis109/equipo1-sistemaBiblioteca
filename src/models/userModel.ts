import { query } from "../config/db.js";

export const UserModel = {
  async findAll(filters: {
    name?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
    limit?: number | undefined;
  }) {
    let sql =
      "SELECT id, name, email, role, phone, created_at FROM users WHERE 1=1";
    const values = [];
    let paramIndex = 1;

    if (filters.name) {
      sql += ` AND name ILIKE $${paramIndex}`;
      values.push(`%${filters.name}%`);
      paramIndex++;
    }
    if (filters.email) {
      sql += ` AND email ILIKE $${paramIndex}`;
      values.push(`%${filters.email}%`);
      paramIndex++;
    }
    if (filters.role) {
      sql += ` AND role = $${paramIndex}`;
      values.push(filters.role);
      paramIndex++;
    }
    sql += " ORDER BY id";

    if (filters.limit) {
      sql += ` LIMIT $${paramIndex}`;
      values.push(filters.limit);
      paramIndex++;
    }

    const { rows } = await query(sql, values);
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
