import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signin, signout } from './api';
import { queryKeys } from './queries';

export function useSigninMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signin,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(queryKeys.me, user);
    },
  });
}

export function useSignoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: queryKeys.me });
      // eslint-disable-next-line unicorn/no-null
      queryClient.setQueryData(queryKeys.me, null);
      queryClient.removeQueries();
    },
  });
}
