import { useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, type To } from 'react-router';

import { useCurrentUser } from '../hooks';

export default function RequireGuest() {
  const { isAuthenticated } = useCurrentUser();
  const { state } = useLocation();
  const navigate = useNavigate();

  const redirect = useCallback((to: To) => navigate(to, { replace: true }), [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const intendedDestination = state?.from;

      if (intendedDestination) {
        redirect(intendedDestination);
      } else if (globalThis.history.length > 2) {
        redirect(-1 as never);
      } else {
        redirect('/');
      }
    }
  }, [isAuthenticated, redirect, state]);

  // eslint-disable-next-line unicorn/no-null
  if (isAuthenticated) return null;

  return <Outlet />;
}
