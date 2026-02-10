import { useMutation } from '@tanstack/react-query';
import { login } from './api';

export function useLogin() {
  return useMutation({
    mutationFn: (token: string) => login(token),
  });
}
