import type { Config, Context } from '@netlify/edge-functions';

import logger from '../../api/logger.ts';
import { API_BASE_URL } from '../../shared/constants.ts';
import type { Failure } from '../../shared/types/api.ts';

export const config: Config = {
  path: `${API_BASE_URL}/*`,
  excludedPath: `${API_BASE_URL}/signin`,
  method: ['POST', 'PUT', 'PATCH'],
};

export default (req: Request, ctx: Context) => {
  logger.info('Validating content-type...');

  const contentType = req.headers.get('content-type');

  if (!contentType || !/^application\/json(;.*)?$/i.test(contentType)) {
    const payload: Failure = {
      status: 'failed',
      error: 'Unsupported data type',
    };

    const meta = {
      requestId: ctx.requestId,
      contentType,
      ip: ctx.ip,
      geo: ctx.geo,
    };

    logger.notice(payload.error, { meta });
    return Response.json(payload, { status: 415 });
  }
};
