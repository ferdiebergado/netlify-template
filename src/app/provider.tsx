import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';

import DarkModeProvider from '@/components/dark-mode/mode-provider';
import QueryErrorBoundary from '@/components/query-error-boundary';
import Splash from '@/components/splash';
import UserProvider from '@/features/auth/components/user-provider';
import { getCSPNonce } from '@/lib/csp';
import ErrorPage from './pages/error-page';

const nonce = getCSPNonce();

type ProviderProps = {
  queryClient: QueryClient;
  googleClientId: string;
  children: ReactNode;
};

export default function Provider({ queryClient, googleClientId, children }: ProviderProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <QueryErrorBoundary ErrorFallbackComponent={ErrorPage} suspenseFallback={<Splash />}>
            <BrowserRouter>
              <GoogleOAuthProvider clientId={googleClientId} locale="en-US" nonce={nonce}>
                <UserProvider>{children}</UserProvider>
              </GoogleOAuthProvider>
            </BrowserRouter>
          </QueryErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} styleNonce={nonce} />
        </DarkModeProvider>
      </QueryClientProvider>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
