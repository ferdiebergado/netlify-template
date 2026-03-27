import type { Config } from '@netlify/edge-functions';

import { API_BASE_URL } from '../../shared/constants.ts';
import type { Failure } from '../../shared/types/api.ts';

export const config: Config = {
  path: `${API_BASE_URL}/*`,
  excludedPath: `${API_BASE_URL}/signin`,
  method: ['POST', 'PUT', 'PATCH'],
};

export default (req: Request) => {
  console.log('Validating content-type...');

  const contentType = req.headers.get('Content-Type');

  if (!contentType || !/^application\/json(;.*)?$/i.test(contentType)) {
    const payload: Failure = {
      status: 'failed',
      error: 'Unsupported data type',
    };
    return Response.json(payload, { status: 415 });
  }
};
