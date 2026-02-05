import * as z from 'zod';
import type { APIResponse } from '../../shared/types/api';

export function validateBody<T>(body: string | null, schema: z.ZodType<T>): T | Response {
  try {
    return schema.parse(JSON.parse(body ?? '{}'));
  } catch {
    const payload: APIResponse<string> = {
      status: 'failed',
      error: 'Invalid request body',
    };

    return Response.json(payload, { status: 400 });
  }
}
