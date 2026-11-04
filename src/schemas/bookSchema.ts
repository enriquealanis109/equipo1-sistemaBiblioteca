import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  publisher: z.string().min(1, { message: "La editorial es obligatoria" }),
  year: z.number().int().min(0, { message: "El año debe ser un número entero positivo si se proporciona." }).optional(),
  category: z.string().min(1, { message: "La categoría es obligatoria" }),
  description: z.string().optional(),
});

export const bookUpdateSchema = bookSchema.partial();