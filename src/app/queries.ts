import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchEnv, fetchWelcome } from './api';

const queryKeys = {
  welcome: ['welcome'] as const,
  env: ['env'] as const,
};

export function useWelcomeQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.welcome,
    queryFn: fetchWelcome,
  });
}

export function useEnvQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.env,
    queryFn: fetchEnv,
  });
}
