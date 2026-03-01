import { ClerkProvider } from '@clerk/clerk-react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { toast } from 'sonner';

import App from '@/app/app';
import DarkModeProvider from '@/components/dark-mode/mode-provider';
import { Toaster } from '@/components/ui/sonner';
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
      <DarkModeProvider>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </BrowserRouter>
        </ClerkProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  </StrictMode>
);
