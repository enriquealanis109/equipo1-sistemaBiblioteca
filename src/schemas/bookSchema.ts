import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  publisher: z.string().min(1, { message: "La editorial es obligatoria" }),
  year: z
    .number()
    .int()
    .min(0, {
      message: "El año debe ser un número entero positivo si se proporciona.",
    })
    .optional(),
  category: z.string().min(1, { message: "La categoría es obligatoria" }),
  description: z.string().optional(),
  limit: z
    .string()
    .regex(/^\d+$/, "El limite debe ser un número.")
    .transform(Number)
    .optional(),
});

export const getBookInputSchema = z.object({
  title: z.string().optional(),
  publisher: z.string().optional(),
  category: z.string().optional(),
  year: z.string().regex(/^\d+$/, "El año debe ser un número").transform(Number).optional(),
  description: z.string().optional(),
  limit: z.string().regex(/^\d+$/, "El límite debe ser un número").transform(Number).optional(),
});

export type GetBookInput = z.infer<typeof getBookInputSchema>;
export const bookUpdateSchema = bookSchema.partial();
