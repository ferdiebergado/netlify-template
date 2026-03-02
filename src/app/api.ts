import { api } from '@/lib/client';
import type { AppEnv } from '@shared/types/api';

export async function fetchEnv() {
  return await api.get<AppEnv>('/env');
}

export async function fetchWelcome() {
  return await api.get('/welcome');
}
