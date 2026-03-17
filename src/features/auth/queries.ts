import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { fetchMe, fetchSessions, revokeSession } from './api';

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

export function useSessionsQuery() {
  return useQuery({
    queryKey: queryKeys.sessions,
    queryFn: fetchSessions,
    staleTime: 60 * 1000,
  });
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
  });
}
