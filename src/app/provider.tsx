import { Toaster } from '@/components/ui/sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { env } from '../config';
import { AuthProvider } from '../features/auth/components/auth-provider';
import DarkModeProvider from '../features/dark-mode/components/mode-provider';

const queryClient = new QueryClient();

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID} locale="en-US">
          <AuthProvider>
            <DarkModeProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </DarkModeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
