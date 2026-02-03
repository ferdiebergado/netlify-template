import type { Config } from '@netlify/functions';
import { db } from '../../api/db';
import { respondWithError } from '../../api/errors';
import { checkHealth } from '../../api/health';

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
