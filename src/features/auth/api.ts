import type { User } from 'shared/schemas/user.schema';
import type { LoginData } from 'shared/types/api';
import { paths } from '../../app/routes';
import { api } from '../../lib/client';

export async function login(token: string) {
  console.log('logging in...');
  return await api.post<LoginData>(paths.login, { token });
}

export async function fetchCurrentUser() {
  console.log('fetching current user...');
  return await api.get<User>(paths.me);
}

export async function logout() {
  console.log('logging out...');
  return await api.post(paths.logout, {});
}
