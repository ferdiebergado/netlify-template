import * as z from 'zod';
import { BadRequestError, MethodNotAllowedError } from './errors';
import logger from './logger';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export function checkMethod(req: Request, allowedMethods: HttpMethod[]) {
  const allowed = new Set<HttpMethod>(allowedMethods);

  if (!allowed.has(req.method as HttpMethod))
    throw new MethodNotAllowedError(`Method ${req.method} is not allowed`, allowedMethods);
}

export async function parseJson<T extends z.ZodType>(
  req: Request,
  schema: T
): Promise<z.infer<typeof schema>> {
  try {
    const jsonData = await req.json();
    const parsedData = schema.parse(jsonData);
    return parsedData;
  } catch (error) {
    logger.error('Failed to parse JSON body', {
      error: error instanceof z.ZodError ? z.flattenError(error).fieldErrors : error,
    });
    throw new BadRequestError('Invalid JSON body');
  }
}
