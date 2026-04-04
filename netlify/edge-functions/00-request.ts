import logger from '@api/logger';
import type { Context } from '@netlify/edge-functions';

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
