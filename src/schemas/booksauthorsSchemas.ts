import { z } from "zod";

const idPositivo = z.object({
  id: z.coerce
    .number({ error: `id debe ser un número` })
    .int(`id debe ser un número entero`)
    .positive(`id debe ser mayor a 0`),
});

export const createBooksAuthorSchema = z.object({
  book_id: idPositivo.shape.id,
  author_id: idPositivo.shape.id,
});

export const booksAuthorParamsSchema = createBooksAuthorSchema;

// Paginacion: ?page=1&limit=10
export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ error: "la página debe ser un número" })
    .int("la página debe ser un número entero")
    .positive("la página debe ser mayor a 0")
    .default(1),
  limit: z.coerce
    .number({ error: "el límite debe ser un número" })
    .int("el límite debe ser un número entero")
    .positive("el límite debe ser mayor a 0")
    .max(100, "el límite no puede ser mayor a 100")
    .default(10),
});

// GET /booksauthors?book_id=1&author_id=2&page=1&limit=10
export const getBooksAuthorsQuerySchema = paginationQuerySchema.extend({
  book_id: idPositivo.shape.id,
  author_id: idPositivo.shape.id,
});

export type CreateBooksAuthorInput = z.infer<typeof createBooksAuthorSchema>;
export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;
export type GetBooksAuthorsQueryInput = z.infer<typeof getBooksAuthorsQuerySchema>;
export type BooksAuthorsParamsInput = z.infer<typeof booksAuthorParamsSchema>;