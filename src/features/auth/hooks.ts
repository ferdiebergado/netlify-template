import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchMe, login } from './api';

export function useLogin() {
  return useMutation({
    mutationFn: (token: string) => login(token),
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
