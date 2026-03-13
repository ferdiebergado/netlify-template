import { paths } from '@/app/routes';
import { api } from '@/lib/client';
import type { Profile } from '@shared/schemas/user.schema';

export async function signin(token: string) {
  return await api.post(paths.signin, { token });
}

export async function fetchMe() {
  return await api.get<Profile>(paths.me);
}
