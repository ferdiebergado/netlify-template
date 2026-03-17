import { paths } from '@/app/routes';
import { api } from '@/lib/client';
import { type Profile } from '@shared/schemas/user.schema';
import type { SessionsData } from '@shared/types/api';

export async function fetchMe() {
  return await api.get<Profile>(paths.me);
}

export async function signout() {
  return await api.post(paths.signout, {});
}

export async function fetchSessions() {
  return await api.get<SessionsData>('/sessions');
}

export async function revokeSession(sessionId: string) {
  return await api.post('/revoke-session', { sessionId });
}
