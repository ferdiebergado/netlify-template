import type { Config } from '@netlify/edge-functions';

import logger from '../../api/logger.ts';
import { API_BASE_URL } from '../../shared/constants.ts';
import type { Failure } from '../../shared/types/api.ts';

export const config: Config = {
  path: `${API_BASE_URL}/*`,
  excludedPath: `${API_BASE_URL}/signin`,
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
};

export default (req: Request) => {
  logger.info('Checking fetch metadata...');

  const fetchSite = req.headers.get('Sec-Fetch-Site');

  if (!fetchSite || fetchSite !== 'same-origin') {
    const payload: Failure = {
      status: 'failed',
      error: fetchSite ? 'cross-origin requests disallowed' : 'missing fetch metadata',
    };
    return Response.json(payload, { status: 401 });
  }
};
