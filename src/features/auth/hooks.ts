import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, login } from './api';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => login(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: false,
  });
}
