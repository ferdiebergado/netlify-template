import { paths } from '@/app/routes';
import { api } from '@/lib/client';
import { type Profile } from '@shared/schemas/user.schema';
import type { SigninData } from '@shared/types/api';

export async function signin(token: string) {
  return await api.post<SigninData>(paths.signin, { token });
}

export async function fetchMe() {
  try {
    return await api.get<Profile>(paths.me);
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line unicorn/no-null
    return null;
  }
}

export async function signout() {
  return await api.post(paths.signout, {});
}
