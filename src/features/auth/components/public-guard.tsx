import { Navigate, Outlet } from 'react-router';

import { useCurrentUser } from '../hooks';

export default function PublicGuard() {
  const { user } = useCurrentUser();

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
}
