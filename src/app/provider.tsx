import DarkModeProvider from '@/components/dark-mode/mode-provider';
import Loading from '@/components/loading';
import QueryErrorBoundary from '@/components/query-error-boundary';
import UserProvider from '@/features/auth/components/user-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'sonner';
import ErrorPage from './pages/error-page';
import FatalErrorPage from './pages/fatal-error-page';

type ProviderProps = {
  queryClient: QueryClient;
  googleClientId: string;
  children: ReactNode;
};

export default function Provider({ queryClient, googleClientId, children }: ProviderProps) {
  return (
    <ErrorBoundary FallbackComponent={FatalErrorPage}>
      <QueryClientProvider client={queryClient}>
        <QueryErrorBoundary ErrorFallbackComponent={ErrorPage} suspenseFallback={<Loading />}>
          <DarkModeProvider>
            <BrowserRouter>
              <GoogleOAuthProvider clientId={googleClientId} locale="en-US">
                <UserProvider>{children}</UserProvider>
              </GoogleOAuthProvider>
            </BrowserRouter>
          </DarkModeProvider>
        </QueryErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}
