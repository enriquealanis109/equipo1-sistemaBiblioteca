import { z } from "zod";

// Esquema para crear y actualizar autores
export const authorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),

  birth_date: z
    .string()
    .date("La fecha debe ser válida y tener formato YYYY-MM-DD")
    .nullable()
    .optional(),

  nationality: z
    .string()
    .max(100, "La nacionalidad no puede superar 100 caracteres")
    .nullable()
    .optional(),
});

// Esquema para crear un autor y asociarlo con libros
export const authorWithBooksSchema = authorSchema.extend({
  book_ids: z
    .array(
      z
        .number()
        .int("El ID del libro debe ser un entero")
        .positive("El ID del libro debe ser positivo"),
    )
    .default([])
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "No se permiten IDs de libros duplicados",
    ),
});

export type AuthorInput = z.infer<typeof authorSchema>;

export type AuthorWithBooksInput = z.infer<
  typeof authorWithBooksSchema
>;