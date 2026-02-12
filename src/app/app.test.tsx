import Loader from '@/components/loader';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { AuthProvider } from '../features/auth/components/auth-provider';
import DarkModeProvider from '../features/dark-mode/components/mode-provider';
import Page from './page';
import FallbackPage from './pages/fallback-page';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

type ProviderProps = {
  initialRoute?: string;
  children: ReactNode;
};

function TestingProvider({ initialRoute = '/', children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <GoogleOAuthProvider clientId={import.meta.env.GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <DarkModeProvider>{children}</DarkModeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function renderApp() {
  return render(
    <TestingProvider>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
            )}
            onReset={reset}
          >
            <Suspense fallback={<Loader />}>
              <Page />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </TestingProvider>
  );
}

describe('<App />', () => {
  it('loads and displays login page', async () => {
    const page = await renderApp();

    const heading = page.getByRole('heading', { name: 'welcome back' });
    await expect.element(heading).toBeInTheDocument();

    const desc = page.getByText(/Login with your Google account/i);
    await expect.element(desc).toBeInTheDocument();
  });
});
