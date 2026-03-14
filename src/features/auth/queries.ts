import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchMe } from './api';

export const queryKeys = {
  me: ['me'] as const,
};

export function useMeQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: Infinity,
  });
}
