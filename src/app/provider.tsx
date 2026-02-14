import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { toast } from 'sonner';

import { env } from '../config';
import CurrentUserProvider from '../features/auth/components/current-user-provider';
import DarkModeProvider from '../features/dark-mode/components/mode-provider';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) toast.error(error.message);
    },
  }),
});

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID} locale="en-US">
          <CurrentUserProvider>
            <DarkModeProvider>
              {children}
              <Toaster position="top-right" richColors />
            </DarkModeProvider>
          </CurrentUserProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
