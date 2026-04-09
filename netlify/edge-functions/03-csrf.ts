import type { Config, Context } from '@netlify/edge-functions';

import logger from '../../api/logger.ts';
import { API_BASE_URL } from '../../shared/constants.ts';
import type { Failure } from '../../shared/types/api.ts';

export const config: Config = {
  path: `${API_BASE_URL}/*`,
  excludedPath: `${API_BASE_URL}/signin`,
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
};

export default (req: Request, ctx: Context) => {
  logger.info('Checking fetch metadata...');

  const payload: Failure = {
    status: 'failed',
    error: '',
  };

  const meta = {
    requestId: ctx.requestId,
    ip: ctx.ip,
    geo: ctx.geo,
  };

  const fetchSite = req.headers.get('Sec-Fetch-Site');

  if (!fetchSite) {
    payload.error = 'missing fetch metadata';
    logger.notice('Missing fetch metadata', { meta });
  }

  if (fetchSite !== 'same-origin') {
    payload.error = 'cross-origin requests disallowed';
    logger.warning('Cross-origin request blocked', { meta });
  }

  return Response.json(payload, { status: 401 });
};
