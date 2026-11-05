import type { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodError } from "zod";
type RequestSource = "body" | "params" | "query";

export function validateSchema(
  schema: ZodObject,
  source: RequestSource = "body",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync(req[source]);
      if (source === "body") {
        req.body = data;
      }
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
