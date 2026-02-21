import { Navigate, Outlet, useLocation } from 'react-router';

import { paths } from '../../../app/routes';
import { useCurrentUser } from '../hooks';

export default function RequireUser() {
  const { isAuthenticated } = useCurrentUser();
  const { pathname } = useLocation();

  if (!isAuthenticated) return <Navigate to={paths.login} state={{ from: pathname }} replace />;

  return <Outlet />;
}
