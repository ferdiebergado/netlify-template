import type { Config } from '@netlify/edge-functions';
import type { Failure } from '@shared/types/api';

export const config: Config = {
  path: '/.netlify/functions/*',
  method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

export default (req: Request) => {
  console.log('Checking fetch metadata...');

  if (
    req.method === 'GET' &&
    req.headers.get('Sec-Fetch-Mode') === 'navigate' &&
    req.headers.get('Sec-Fetch-Dest') !== 'object' &&
    req.headers.get('Sec-Fetch-Dest') !== 'embed'
  )
    return;

  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (unsafeMethods.includes(req.method)) {
    const fetchSite = req.headers.get('Sec-Fetch-Site');

    if (!fetchSite || fetchSite !== 'same-origin') {
      const payload: Failure = {
        status: 'failed',
        error: 'cross-origin requests are not allowed',
      };
      return Response.json(payload, { status: 401 });
    }
  }
};
