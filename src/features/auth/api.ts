import type { User } from 'shared/schemas/user.schema';
import { paths } from '../../app/routes';
import { api } from '../../lib/client';

export async function login(token: string) {
  return await api.post(paths.login, { token });
}

export async function fetchMe() {
  return await api.get<User>('/me');
}
