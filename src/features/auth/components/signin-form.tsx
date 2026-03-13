import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import type { ComponentProps } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type SigninFormProps = ComponentProps<'div'> & {
  onSuccess: (creds: CredentialResponse) => void;
  onError: () => void;
};

export function SigninForm({ className, onSuccess, onError, ...props }: SigninFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Signin with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLogin
            theme="filled_blue"
            size="large"
            text="continue_with"
            onSuccess={onSuccess}
            onError={onError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
