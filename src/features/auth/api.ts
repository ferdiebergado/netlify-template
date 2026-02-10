import { api } from '../../lib/client';

export function fetchMe(token: string) {
  return api.post('/me', { token });
}
