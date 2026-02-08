import * as z from 'zod';
import { BadRequestError } from './errors';

export function validateBody<T>(body: unknown, schema: z.ZodType<T>): T {
  const { error, data } = schema.safeParse(body);

  if (error) throw new BadRequestError(error.message);

  return data;
}
