import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router';
import FallbackPage from './pages/fallback-page';
const queryClient = new QueryClient();

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              fallbackRender={({ error, resetErrorBoundary }) => (
                <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
              )}
              onReset={reset}
            >
              {children}
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
