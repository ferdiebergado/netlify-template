import logger from '@api/logger';
import type { Config, Context } from '@netlify/edge-functions';

export const config: Config = {
  path: '/api/*',
};

export default (req: Request, ctx: Context) => {
  logger.info('Received request', {
    requestId: ctx.requestId,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    geo: ctx.geo,
    ip: ctx.ip,
  });
};
