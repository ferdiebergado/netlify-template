import type { Config, Context } from '@netlify/edge-functions';

import { SESSION_COOKIE_NAME, SESSION_HEADER_NAME } from '../../api/constants.ts';
import { API_BASE_URL } from '../../shared/constants.ts';

export const config: Config = {
  path: `${API_BASE_URL}/*`,
  excludedPath: `${API_BASE_URL}/signin`,
};

export default (req: Request, ctx: Context) => {
  console.log('Looking for active session...');

  const sessionId = ctx.cookies.get(SESSION_COOKIE_NAME);
  if (!sessionId) return new Response('Unauthorized', { status: 401 });

  req.headers.set(SESSION_HEADER_NAME, sessionId);
};
