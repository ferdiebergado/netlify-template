import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, login } from './api';

const authKeys = {
  currentUser: ['current-user'] as const,
};

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => login(token),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.currentUser, user);
    },
  });
}

// TODO: match staleTime with session duration
export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: false,
  });
}
