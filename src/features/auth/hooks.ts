import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { fetchMe, login } from './api';

export function useLogin() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token: string) => login(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      const from = location.state?.from ?? '/';
      navigate(from, { replace: true });
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
