import type { Config, Context } from '@netlify/edge-functions';
import logger from '../../api/logger.ts';

export const config: Config = {
  path: '/api/*',
};

export default (req: Request, ctx: Context) => {
  const request = {
    requestId: ctx.requestId,
    method: req.method,
    url: req.url,
  };

  logger.info('Received request', { request });
};
