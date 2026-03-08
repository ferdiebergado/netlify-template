import { ClerkProvider } from '@clerk/react-router';
import { shadcn } from '@clerk/ui/themes';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { toast } from 'sonner';

import App from '@/app/app';
import DarkModeProvider from '@/components/dark-mode/mode-provider';
import { Toaster } from '@/components/ui/sonner';
import UserProvider from '@/features/auth/components/user-provider';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './app/pages/error-page';
import { paths } from './app/routes';
import { env } from './config';
import './index.css';

const CLERK_PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) toast.error(error.message);
    },
  }),
});

const root = document.querySelector('#root');

createRoot(root!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <DarkModeProvider>
          <BrowserRouter>
            <ClerkProvider
              publishableKey={CLERK_PUBLISHABLE_KEY}
              signInUrl={paths.signin}
              signUpUrl={paths.signup}
              appearance={{ theme: shadcn }}
            >
              <UserProvider>
                <App />
                <Toaster position="top-right" richColors />
                <ReactQueryDevtools initialIsOpen={false} />
              </UserProvider>
            </ClerkProvider>
          </BrowserRouter>
        </DarkModeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
