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