import FullPageLoader from '@/components/full-page-loader';
import QueryErrorBoundary from '@/components/query-error-boundary';
import Page from './page';
import FallbackPage from './pages/fallback-page';
import Provider from './provider';

export function App() {
  return (
    <Provider>
      <QueryErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
        suspenseFallback={<FullPageLoader />}
      >
        <Page />
      </QueryErrorBoundary>
    </Provider>
  );
}

export default App;
