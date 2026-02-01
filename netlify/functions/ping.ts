import type { Config } from '@netlify/functions';
import { getHealth } from '../../api/health';

export const config: Config = {
  method: 'GET',
  path: '/api/health',
};

export default async () => {
  return Response.json({ data: getHealth() });
};
