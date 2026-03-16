import { GoogleLogin } from '@react-oauth/google';
import type { ComponentProps } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { env } from '@/config';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function SigninForm({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Signin with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleLogin
            ux_mode="redirect"
            login_uri={`${env.VITE_APP_HOST}/.netlify/functions/signin`}
            theme="filled_blue"
            size="large"
            text="continue_with"
            onSuccess={() => toast.success('Signed in.')}
            onError={() => toast.error('Signin failed.')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
