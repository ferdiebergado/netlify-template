import { GoogleOAuthProvider } from '@react-oauth/google';
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
import { env } from './config';
import './index.css';

const googleClientId = env.VITE_GOOGLE_CLIENT_ID;

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
        <BrowserRouter>
          <GoogleOAuthProvider clientId={googleClientId} locale="en-US">
            <UserProvider>
              <App />
              <Toaster position="top-right" richColors />
              <ReactQueryDevtools initialIsOpen={false} />
            </UserProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </DarkModeProvider>
    </QueryClientProvider>
  </StrictMode>
);
