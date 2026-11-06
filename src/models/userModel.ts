import { query } from "../config/db.js";

export const UserModel = {
  async findAll(filters: {
    name?: string | undefined;
    email?: string | undefined;
    role?: string | undefined;
    page: number;
    limit: number;
  }) {
    const { name, email, role, page, limit } = filters;
    let sql = "WHERE 1=1";
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.name) {
      sql += ` AND name ILIKE $${paramIndex}`;
      values.push(`%${name}%`);
      paramIndex++;
    }
    if (filters.email) {
      sql += ` AND email ILIKE $${paramIndex}`;
      values.push(`%${email}%`);
      paramIndex++;
    }
    if (filters.role) {
      sql += ` AND role = $${paramIndex}`;
      values.push(role);
      paramIndex++;
    }

    // Contar todos los que cumplen los filtros
    const countQuery = `SELECT COUNT(*) FROM users ${sql}`;
    const countResult = await query(countQuery, values);
    const totalItem = parseInt(countResult.rows[0].count, 10);

    // Traer solo los de esta pagina
    const offset = (page - 1) * limit;
    const dataQuery = `SELECT id, name, email, role, phone, created_at FROM users ${sql} ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const { rows } = await query(dataQuery, [...values, limit, offset]);
    return {
      data: rows,
      pagination: {
        totalItem,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalItem / limit),
      },
    };
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
