import type { Config } from '@netlify/functions';
import { db } from '../_shared/db';
import { checkHealth } from '../_shared/ping';
import { respondWithError } from '../errors';

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
