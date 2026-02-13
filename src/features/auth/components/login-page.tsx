import Loader from '@/components/loader';
import type { CredentialResponse } from '@react-oauth/google';
import { GalleryVerticalEnd } from 'lucide-react';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../hooks';
import { useLoginMutation } from '../queries';
import { LoginForm } from './login-form';

export default function LoginPage() {
  const { isLoading } = useAuth();
  const { isPending, mutate: login } = useLoginMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSuccess = useCallback(
    ({ credential }: CredentialResponse) => {
      if (!credential) return;
      login(credential, {
        onSuccess: ({ message }) => {
          if (message) toast.success(message);
          const from = location.state?.from ?? '/';
          navigate(from, { replace: true });
        },
        onError: (error: Error) => {
          toast.error(error.message);
        },
      });
    },
    [location.state?.from, login, navigate]
  );

  const handleError = useCallback(() => {
    toast.error('Login failed.');
  }, []);

  if (isPending || isLoading) return <Loader />;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}
