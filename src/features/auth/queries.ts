import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { fetchMe, login } from './api';

const authKeys = {
  me: ['me'] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (token: string) => login(token),
    onSuccess: ({ message }) => {
      if (message) toast.success(message);
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      const from = location.state?.from ?? '/';
      navigate(from, { replace: true });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    throwOnError: false,
  });
}
