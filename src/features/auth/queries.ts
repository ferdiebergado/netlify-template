import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, login } from './api';

const authKeys = {
  me: ['me'] as const,
};

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => login(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

// TODO: match staleTime with session duration
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: false,
  });
}
