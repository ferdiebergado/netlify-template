import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { paths } from '@/app/routes';

export default function RequireUser() {
  const { isSignedIn } = useAuth();
  const { pathname } = useLocation();

  if (!isSignedIn) return <Navigate to={paths.login} state={{ from: pathname }} replace />;

  return <Outlet />;
}
