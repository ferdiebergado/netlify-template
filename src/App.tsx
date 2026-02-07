import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from '@tanstack/react-query';
import { RouterRoot } from '@typeroute/router';
import { ErrorBoundary } from 'react-error-boundary';
import FallbackPage from './pages/fallback-page';
import { routes } from './routes';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
            )}
            onReset={reset}
          >
            <RouterRoot routes={routes} />;
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </QueryClientProvider>
  );
}

export default App;
