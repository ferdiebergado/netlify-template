import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import { ClerkProvider } from '@clerk/clerk-react';
import App from './app';

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
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </ClerkProvider>
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

    const heading = page.getByRole('heading', { name: 'sign in to' });
    await expect.element(heading).toBeInTheDocument();

    const desc = page.getByText(/continue with google/i);
    await expect.element(desc).toBeInTheDocument();
  });
});
