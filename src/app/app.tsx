import { useRoutes } from 'react-router';

import FullPageLoader from '@/components/full-page-loader';
import QueryErrorBoundary from '@/components/query-error-boundary';
import FallbackPage from './pages/fallback-page';
import { routes } from './routes';

export default function App() {
  const page = useRoutes(routes);

  return (
    <QueryErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <FallbackPage error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      suspenseFallback={<FullPageLoader />}
    >
      {page}
    </QueryErrorBoundary>
  );
}
