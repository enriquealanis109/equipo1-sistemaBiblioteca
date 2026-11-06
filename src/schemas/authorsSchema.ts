import { z } from "zod";

const birthDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La fecha debe tener el formato YYYY-MM-DD",
  })
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, {
    message: "La fecha de nacimiento no es válida",
  });

export const authorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre debe tener máximo 150 caracteres"),

  birth_date: birthDateSchema.nullable().optional(),

  nationality: z
    .string()
    .max(100, "La nacionalidad debe tener máximo 100 caracteres")
    .nullable()
    .optional(),
});

export const authorIdSchema = z.object({
  id: z.coerce
    .number()
    .int("El ID debe ser un número entero")
    .positive("El ID debe ser un entero positivo"),
});

const queryInteger = (defaultValue: number, maximum: number) =>
  z.preprocess(
    (value) => {
      if (value === undefined) {
        return defaultValue;
      }
      if (typeof value === "string" && /^\d+$/.test(value)) {
        return Number(value);
      }
      return value;
    },
    z
      .number()
      .int("Debe ser un número entero")
      .min(1, "Debe ser al menos 1")
      .max(maximum, `No puede ser mayor que ${maximum}`),
  );

const optionalQueryText = (maximum: number, field: string) =>
  z.preprocess(
    (value) =>
      typeof value === "string" ? value.trim() || undefined : value,
    z
      .string()
      .max(maximum, `${field} debe tener máximo ${maximum} caracteres`)
      .optional(),
  );

export const authorListQuerySchema = z.object({
  page: queryInteger(1, 1_000_000),
  limit: queryInteger(10, 100),
  search: optionalQueryText(150, "La búsqueda"),
  nationality: optionalQueryText(100, "La nacionalidad"),
});

export type AuthorListQuery = z.infer<typeof authorListQuerySchema>;