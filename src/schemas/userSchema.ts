import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ error: "el nombre es obligatorio" })
    .trim()
    .min(2, "el nombre debe tener al menos 2 caracteres")
    .max(100, "el nombre no puede superar los 100 caracteres"),
  email: z
    .string({ error: "el email es obligatorio" })
    .trim()
    .toLowerCase()
    .email("el formato del email no es válido")
    .max(100, "el email no puede superar los 100 caracteres"),
  role: z.enum(["estudiante", "docente"], {
    message: "el rol debe ser estudiante o docente",
  }),
  phone: z
    .string()
    .trim()
    .max(20, "el teléfono no puede superar los 20 caracteres")
    .optional(),
});

export const getUsersQuerySchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  role: z
    .enum(["estudiante", "docente"], {
      message: "el rol debe ser estudiante o docente",
    })
    .optional(),
  limit: z.string().regex(/^\d+$/, "el límite debe ser un número").optional(),
});

export const updateUserSchema = createUserSchema;
export type GetUsersQueryInput = z.infer<typeof getUsersQuerySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
