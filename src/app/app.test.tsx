/* eslint-disable unicorn/no-null */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import QueryErrorBoundary from '@/components/query-error-boundary';
import UserProvider from '@/features/auth/components/user-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Page from './page';

const createTestQueryClient = () =>
  new QueryClient({
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
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorBoundary suspenseFallback={null}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <GoogleOAuthProvider clientId="test-client-id" locale="en-US">
            <UserProvider>{children}</UserProvider>
          </GoogleOAuthProvider>
        </MemoryRouter>
      </QueryErrorBoundary>
    </QueryClientProvider>
  );
}

async function renderApp() {
  return render(
    <TestingProvider>
      <Page />
    </TestingProvider>
  );
}

describe('App Component', () => {
  it('loads and displays login page', async () => {
    const { getByText } = await renderApp();

    const heading = getByText(/welcome back/i);
    await expect.element(heading).toBeInTheDocument();

    const desc = getByText(/signin with your google account/i);
    await expect.element(desc).toBeInTheDocument();
  });
});
