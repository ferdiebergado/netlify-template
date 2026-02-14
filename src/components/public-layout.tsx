import { Navigate, Outlet } from 'react-router';
import { useCurrentUser } from '../features/auth/hooks';
import FullPageLoader from './full-page-loader';

export default function PublicLayout() {
  const { isLoading, user } = useCurrentUser();

  if (isLoading) return <FullPageLoader />;

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="bg-muted flex h-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
