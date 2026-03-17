import { paths } from '@/app/routes';
import { api } from '@/lib/client';
import { type Profile } from '@shared/schemas/user.schema';
import type { SessionsData } from '@shared/types/api';

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

export async function fetchSessions() {
  try {
    return await api.get<SessionsData>('/sessions');
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line unicorn/no-null
    return null;
  }
}

export async function revokeSession(sessionId: string) {
  try {
    const response = await api.post<{ revoked: boolean }>('/revoke-session', { sessionId });
    return response.revoked;
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line unicorn/no-null
    return null;
  }
}
