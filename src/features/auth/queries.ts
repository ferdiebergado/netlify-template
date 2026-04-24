import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchMe, revokeSession } from './api';

export const queryKeys = {
  me: ['me'] as const,
  sessions: ['sessions'] as const,
};

export function useMeQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    retry: false,
    staleTime: Infinity,
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
  });
}
