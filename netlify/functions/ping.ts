import type { Config } from '@netlify/functions';
import { db } from '../_shared/db';
import { respondWithError } from '../_shared/errors';
import { checkHealth } from '../_shared/ping';

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
