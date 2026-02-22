import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { toast } from 'sonner';

import DarkModeProvider from '@/components/dark-mode/mode-provider';
import { env } from '../config';
import UserProvider from '../features/auth/components/user-provider';

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
      <DarkModeProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID} locale="en-US">
            <UserProvider>
              {children}
              <Toaster position="top-right" richColors />
              <ReactQueryDevtools initialIsOpen={false} />
            </UserProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}
