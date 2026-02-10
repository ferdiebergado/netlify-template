import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../features/auth/context';
import Loader from './loader';

type LocationState = {
  from?: string;
};

export default function PublicLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const path = state?.from ?? '/';

  if (isLoading) return <Loader />;

  if (user) return <Navigate to={path} replace />;

  return (
    <main className="bg-muted flex h-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
