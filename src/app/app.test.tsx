import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import UserProvider from '../features/auth/components/user-provider';
import App from './app';

const googleClientID = Math.random().toString(36).slice(2, 7);

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
        <GoogleOAuthProvider clientId={googleClientID}>
          <UserProvider>{children}</UserProvider>
        </GoogleOAuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

async function renderApp() {
  return render(
    <TestingProvider>
      <App />
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
