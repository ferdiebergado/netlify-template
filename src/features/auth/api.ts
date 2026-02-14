import type { User } from 'shared/schemas/user.schema';
import type { LoginData } from 'shared/types/api';
import { paths } from '../../app/routes';
import { api } from '../../lib/client';

export async function login(token: string) {
  console.log('logging in...');
  return await api.post<LoginData>(paths.login, { token });
}

export async function fetchMe() {
  console.log('fetching current user...');
  return await api.get<User>('/me');
}
