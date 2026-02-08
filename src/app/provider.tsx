import DarkModeProvider from '@/features/dark-mode/components/mode-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';

const queryClient = new QueryClient();

type ProviderProps = {
  children: ReactNode;
};

export default function Provider({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <DarkModeProvider>{children}</DarkModeProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
