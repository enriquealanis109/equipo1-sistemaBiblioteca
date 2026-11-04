import { z } from "zod";

const idPositivo = (campo: string) =>
  z.coerce
    .number({ error: `${campo} debe ser un número` })
    .int(`${campo} debe ser un número entero`)
    .positive(`${campo} debe ser mayor a 0`);

export const createBooksAuthorSchema = z.object({
  book_id: idPositivo("book_id"),
  author_id: idPositivo("author_id"),
});

export const booksAuthorParamsSchema = createBooksAuthorSchema;
export type CreateBooksAuthorInput = z.infer<typeof createBooksAuthorSchema>;