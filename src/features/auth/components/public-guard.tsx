import { Navigate, Outlet } from 'react-router';

import { useCurrentUser } from '../hooks';

export default function PublicGuard() {
  const { isAuthenticated } = useCurrentUser();

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
