import { Navigate, Outlet } from 'react-router';
import { useCurrentUser } from '../features/auth/hooks';
import Loader from './loader';

export default function PublicLayout() {
  const { isLoading, user } = useCurrentUser();

  if (isLoading) return <Loader />;

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="bg-muted flex h-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
