import { api } from '../../lib/client';

export function login(token: string) {
  return api.post('/login', { token });
}
