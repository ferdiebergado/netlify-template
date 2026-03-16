import type { Config } from '@netlify/edge-functions';
import type { Failure } from '@shared/types/api';

export const config: Config = {
  path: '/.netlify/functions/*',
  excludedPath: '/.netlify/functions/signin',
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
};

export default (req: Request) => {
  console.log('Checking fetch metadata...');

  const fetchSite = req.headers.get('Sec-Fetch-Site');

  if (!fetchSite || fetchSite !== 'same-origin') {
    const payload: Failure = {
      status: 'failed',
      error: 'cross-origin requests are not allowed',
    };
    return Response.json(payload, { status: 401 });
  }
};
