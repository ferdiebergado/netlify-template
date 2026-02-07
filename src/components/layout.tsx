import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <main className="flex justify-center p-8">
      <Outlet />
    </main>
  );
}
