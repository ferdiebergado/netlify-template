import type { Config } from '@netlify/edge-functions';
import type { Failure } from '@shared/types/api';

export const config: Config = {
  path: '/.netlify/functions/*',
  method: ['POST', 'PUT', 'DELETE'],
};

export default (req: Request) => {
  console.log('Checking fetch metadata headers...');

  if (
    req.headers.get('Sec-Fetch-Mode') === 'navigate' &&
    req.method === 'GET' &&
    req.headers.get('Sec-Fetch-Dest') !== 'object' &&
    req.headers.get('Sec-Fetch-Dest') !== 'embed'
  ) {
    return;
  }

  const fetchSite = req.headers.get('Sec-Fetch-Site');

  if (fetchSite !== 'same-origin') {
    const payload: Failure = {
      status: 'failed',
      error: 'cross-origin requests are not allowed',
    };
    return Response.json(payload, { status: 401 });
  }
};
