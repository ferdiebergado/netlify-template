import { Navigate, Outlet, useLocation } from 'react-router';

import { useCurrentUser } from '../hooks';

export default function RequireGuest() {
  const { isAuthenticated } = useCurrentUser();
  const { state } = useLocation();

  if (isAuthenticated) {
    const to = state?.from;
    if (to) return <Navigate to={to} replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
