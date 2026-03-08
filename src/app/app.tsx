import { useRoutes } from 'react-router';

import FullPageLoader from '@/components/full-page-loader';
import SuspenseQueryErrorBoundary from '@/components/suspense-query-error-boundary';
import ErrorPage from './pages/error-page';
import { routes } from './routes';

export default function App() {
  const page = useRoutes(routes);

  return (
    <SuspenseQueryErrorBoundary
      ErrorFallbackComponent={ErrorPage}
      suspenseFallback={<FullPageLoader />}
    >
      {page}
    </SuspenseQueryErrorBoundary>
  );
}
