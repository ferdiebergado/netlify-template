import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, login, logout } from './api';

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

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: authKeys.currentUser });
      // eslint-disable-next-line unicorn/no-null
      queryClient.setQueryData(authKeys.currentUser, null);
      queryClient.removeQueries();
    },
  });
}
