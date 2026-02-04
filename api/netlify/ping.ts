import type { Config } from '@netlify/functions';
import { db } from '../db';
import { respondWithError } from '../errors';
import { checkHealth } from '../use-cases/ping';

export const config: Config = {
  method: 'GET',
  path: '/api/ping',
};

export default async () => {
  try {
    await checkHealth(db);
    const data = { message: 'up' };
    return Response.json({ data });
  } catch (error) {
    respondWithError(error);
  }
};
