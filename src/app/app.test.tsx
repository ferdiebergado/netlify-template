import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import FullPageLoader from '@/components/full-page-loader';
import QueryErrorBoundary from '@/components/query-error-boundary';
import DarkModeProvider from '../components/dark-mode/mode-provider';
import UserProvider from '../features/auth/components/user-provider';
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
          <UserProvider>
            <DarkModeProvider>{children}</DarkModeProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function renderApp() {
  return render(
    <TestingProvider>
      <QueryErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
        suspenseFallback={<FullPageLoader />}
      >
        <Page />
      </QueryErrorBoundary>
    </TestingProvider>
  );
}

describe('<App />', () => {
  it('loads and displays login page', async () => {
    const page = await renderApp();

    const heading = page.getByRole('heading', { name: 'welcome back' });
    await expect.element(heading).toBeInTheDocument();

    const desc = page.getByText(/login with your google account/i);
    await expect.element(desc).toBeInTheDocument();
  });
});
