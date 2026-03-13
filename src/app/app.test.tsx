import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import UserProvider from '@/features/auth/components/user-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Page from './page';

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
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} locale="en-US">
          <UserProvider>{children}</UserProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
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
    const page = await renderApp();

    const heading = page.getByText(/welcome back/i);
    await expect.element(heading).toBeInTheDocument();

    const desc = page.getByText(/signin with your google account/i);
    await expect.element(desc).toBeInTheDocument();
  });
});
