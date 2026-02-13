import { Navigate, Outlet } from 'react-router';
import { useCurrentUser } from '../features/auth/hooks';

export default function PublicLayout() {
  const { user } = useCurrentUser();

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="bg-muted flex h-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
