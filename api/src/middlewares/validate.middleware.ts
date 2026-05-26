import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ERROR_CODES } from '../constants/errors';

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body:   req.body,
        query:  req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: ERROR_CODES.INVALID_DATA,
          details: err.errors.map((e) => ({
            field: e.path.slice(1).join('.'),
            message: e.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
}
