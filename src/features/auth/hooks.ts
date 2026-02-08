import { useMutation } from '@tanstack/react-query';
import { fetchMe } from './api';

export function useMe() {
  return useMutation({
    mutationFn: (token: string) => fetchMe(token),
  });
}
