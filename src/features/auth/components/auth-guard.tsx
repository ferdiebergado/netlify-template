import { Navigate, Outlet, useLocation } from 'react-router';

import FullPageLoader from '@/components/full-page-loader';
import { paths } from '../../../app/routes';
import { useCurrentUser } from '../hooks';

export default function AuthGuard() {
  const { isLoading, user } = useCurrentUser();
  const { pathname } = useLocation();

  if (isLoading) return <FullPageLoader />;

  if (!user) return <Navigate to={paths.login} replace state={{ from: pathname }} />;

  return <Outlet />;
}
