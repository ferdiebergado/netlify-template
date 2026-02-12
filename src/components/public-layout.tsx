import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../features/auth/context';
import Loader from './loader';
import { Toaster } from './ui/sonner';

export default function PublicLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (user) return <Navigate to="/" replace />;

  return (
    <>
      <main className="bg-muted flex h-screen items-center justify-center">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
}
