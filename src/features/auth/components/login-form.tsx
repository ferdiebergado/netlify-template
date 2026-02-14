import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { type ComponentProps } from 'react';

import Loader from '@/components/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldDescription } from '@/components/ui/field';
import { cn } from '../../../lib/utils';

type LoginFormProps = ComponentProps<'div'> & {
  onSuccess: (creds: CredentialResponse) => void;
  onError: () => void;
  isLoggingIn: boolean;
};

export function LoginForm({
  className,
  isLoggingIn,
  onSuccess,
  onError,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            <h1 className="text-xl">Welcome back</h1>
          </CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {isLoggingIn ? (
            <Loader text="Logging in..." />
          ) : (
            <GoogleLogin
              size="large"
              theme="filled_blue"
              shape="rectangular"
              onSuccess={onSuccess}
              onError={onError}
            />
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
