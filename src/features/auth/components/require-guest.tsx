import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router';

export default function RequireGuest() {
  const { isSignedIn } = useAuth();
  const { state } = useLocation();

  if (isSignedIn) {
    const to = state?.from;
    if (to) return <Navigate to={to} replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
