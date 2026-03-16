import { paths } from '@/app/routes';
import { api } from '@/lib/client';
import { type Profile } from '@shared/schemas/user.schema';

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
