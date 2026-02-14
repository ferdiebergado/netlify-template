import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import FullPageLoader from '@/components/full-page-loader';
import Page from './page';
import FallbackPage from './pages/fallback-page';
import Provider from './provider';

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
            <Suspense fallback={<FullPageLoader />}>
              <Page />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Provider>
  );
}

export default App;
