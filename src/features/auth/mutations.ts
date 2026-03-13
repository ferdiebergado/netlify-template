import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signin } from './api';
import { queryKeys } from './queries';

export function useSigninMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}
