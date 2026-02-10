import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../features/auth/context';
import { ModeToggle } from '../features/dark-mode/components/mode-toggle';
import Loader from './loader';

export default function Layout() {
  const { isLoading, user } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) return <Loader />;

  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />;

  return (
    <div className="bg-muted h-screen">
      <header className="p-5">
        <ModeToggle />
      </header>
      <main className="flex justify-center p-8">
        <Outlet />
      </main>
    </div>
  );
}
