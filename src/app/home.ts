import { api } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';

export const homeQueryKeys = {
  welcome: ['welcome'],
};

async function fetchWelcome() {
  return await api.get('/welcome');
}

export function useWelcome() {
  return useQuery({
    queryKey: homeQueryKeys.welcome,
    queryFn: fetchWelcome,
  });
}
