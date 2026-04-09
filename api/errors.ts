import type { Failure } from '@shared/types/api';
import type { HttpMethod } from './http';
import logger from './logger';

export class HttpError extends Error {
  readonly statusCode: number;
  readonly name: string;

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
  readonly errors?: Record<string, string[]>;

  constructor(message = 'Bad request', errors?: Record<string, string[]>) {
    super(400, message);
    this.errors = errors;
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

  if (statusCode === 500) {
    logger.error('Internal Server Error', { error });
  } else {
    logger.notice('Client error', { error });
  }

  return Response.json(failure, { status: statusCode });
}
