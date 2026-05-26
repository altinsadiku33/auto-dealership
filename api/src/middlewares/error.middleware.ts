import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from './app-error';
import { ERROR_CODES } from '../constants/errors';
import { env } from '../env';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: ERROR_CODES.INVALID_DATA,
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.code,
    });
    return;
  }

  // Unknown errors — never leak internals in production
  // Replace this block with Sentry.captureException(err) once @sentry/node is configured
  // and SENTRY_DSN is set in .env
  if (env.NODE_ENV !== 'production') {
    process.stderr.write(`[error] ${err.stack || err.message}\n`);
  }

  res.status(500).json({
    success: false,
    error: ERROR_CODES.INTERNAL_SERVER_ERROR,
  });
}
