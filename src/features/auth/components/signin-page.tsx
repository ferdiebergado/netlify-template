import type { CredentialResponse } from '@react-oauth/google';
import { GalleryVerticalEnd } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useSigninMutation } from '../mutations';
import { SigninForm } from './signin-form';

export default function SigninPage() {
  const { mutate: signin } = useSigninMutation();

  const handleSuccess = useCallback(
    ({ credential }: CredentialResponse) => {
      if (!credential) return;

      signin(credential, {
        onSuccess: ({ message }) => {
          if (message) toast.success(message);
        },
      });
    },
    [signin]
  );

  const handleError = useCallback(() => toast.error('Signin failed.'), []);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Digital Empire Inc.
        </a>
        <SigninForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}
