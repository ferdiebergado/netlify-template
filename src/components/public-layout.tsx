import { Outlet } from 'react-router';

export default function PublicLayout() {
  return (
    <main className="bg-muted flex min-h-screen items-center justify-center">
      <Outlet />
    </main>
  );
}
