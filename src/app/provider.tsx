import DarkModeProvider from '@/features/dark-mode/components/mode-provider';
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
        <DarkModeProvider>{children}</DarkModeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
