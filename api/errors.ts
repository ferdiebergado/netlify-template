import type { APIResponse } from './response';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly name: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export function respondWithError(error: unknown) {
  const res: APIResponse<{ message: string }> = {
    status: 'failed',
    error: {
      message: 'Something went wrong.',
    },
  };

  let statusCode = 500;

  if (error instanceof HttpError) {
    res.error.message = error.message;
    statusCode = error.statusCode;
  }

  return Response.json(res, { status: statusCode });
}
