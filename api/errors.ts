import type { Failure } from '@shared/types/api';
import type { HttpMethod } from './http';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly name: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
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

export class MethodNotAllowedError extends HttpError {
  allowedmethods: HttpMethod[] = [];

  constructor(message = 'Method Not Allowed', allowedMethods: HttpMethod[] = []) {
    super(405, message);
    this.allowedmethods = allowedMethods;
  }
}

export function respondWithError(error: unknown) {
  console.error(error);

  const failure: Failure = {
    status: 'failed',
    error: 'Something went wrong.',
  };

  let statusCode = 500;

  if (error instanceof HttpError) {
    if (error instanceof MethodNotAllowedError) {
      return new Response(error.message, {
        status: error.statusCode,
        headers: {
          Allow: error.allowedmethods.join(', '),
        },
      });
    }
    failure.error = error.message;
    statusCode = error.statusCode;
  }

  return Response.json(failure, { status: statusCode });
}
