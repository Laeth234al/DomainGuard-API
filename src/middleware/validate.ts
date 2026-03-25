import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function validate(
  schema: ZodSchema,
  source: "body" | "query" | "params"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    //
    const result = schema.safeParse(req[source]);
    //
    if (!result.success) {
      //
      return res.status(400).json({
        //
        message: "Validation error",
        //
        errors: result.error.format(),
      });
    }
    //
    req[source] = result.data;
    //
    next();
  };
}
