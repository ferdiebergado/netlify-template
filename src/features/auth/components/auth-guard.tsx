import { Navigate, Outlet, useLocation } from 'react-router';
import { useCurrentUser } from '../hooks';

export default function AuthGuard() {
  const { user } = useCurrentUser();
  const { pathname } = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />;

  return <Outlet />;
}
