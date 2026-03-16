import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signout } from './api';
import { queryKeys } from './queries';

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
