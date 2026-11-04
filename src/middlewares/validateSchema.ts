import type { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodError } from "zod";

export function validateSchema(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const flattened = z.flattenError(error);
        res.status(400).json({
          ok: false,
          mensaje: "Error de validación en los datos enviados",
          errors: flattened.fieldErrors,
        });
        return;
      }
      next(error);
    }
  };
}
