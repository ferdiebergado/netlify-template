import type { Config } from '@netlify/edge-functions';
import { API_BASE_URL } from '../../shared/constants';
import type { Failure } from '../../shared/types/api';

export const config: Config = {
  path: `${API_BASE_URL}/*`,
  excludedPath: `${API_BASE_URL}/signin`,
  method: ['POST', 'PUT', 'PATCH', 'DELETE'],
};

export default (req: Request) => {
  console.log('Checking fetch metadata...');

  const fetchSite = req.headers.get('Sec-Fetch-Site');

  if (!fetchSite || fetchSite !== 'same-origin') {
    const payload: Failure = {
      status: 'failed',
      error: 'cross-origin requests disallowed',
    };
    return Response.json(payload, { status: 401 });
  }
};
