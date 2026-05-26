import { ErrorCode } from '../constants/errors';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(code: ErrorCode, resource: string) {
    super(code, `${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(code: ErrorCode = 'UNAUTHORIZED') {
    super(code, 'Unauthorized', 401);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super('FORBIDDEN', 'Forbidden', 403);
  }
}

export class ConflictError extends AppError {
  constructor(code: ErrorCode, message: string) {
    super(code, message, 409);
  }
}
