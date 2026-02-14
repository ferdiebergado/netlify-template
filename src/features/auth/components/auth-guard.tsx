import { Navigate, Outlet, useLocation } from 'react-router';

import Loader from '@/components/loader';
import { paths } from '../../../app/routes';
import { useCurrentUser } from '../hooks';

export default function AuthGuard() {
  const { isLoading, user } = useCurrentUser();
  const { pathname } = useLocation();

  if (isLoading) return <Loader />;

  if (!user) return <Navigate to={paths.login} replace state={{ from: pathname }} />;

  return <Outlet />;
}
