import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import FallbackPage from './pages/fallback-page';
import Provider from './provider';
import Router from './router';

export function App() {
  return (
    <Provider>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
            )}
            onReset={reset}
          >
            <Router />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Provider>
  );
}

export default App;
