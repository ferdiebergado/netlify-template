import Loader from '@/components/loader';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks';

export default function AuthGuard() {
  const { isLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) return <Loader />;

  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />;

  return <Outlet />;
}
