import { SESSION_COOKIE_NAME, SESSION_HEADER_NAME } from '@api/constants';
import type { Context } from '@netlify/edge-functions';

export default (req: Request, ctx: Context) => {
  const sessionId = ctx.cookies.get(SESSION_COOKIE_NAME);
  if (!sessionId) return new Response('Unauthorized', { status: 401 });

  req.headers.set(SESSION_HEADER_NAME, sessionId);
};
