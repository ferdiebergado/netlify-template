import { ModeToggle } from '@/features/dark-mode/components/mode-toggle';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <>
      <header className="p-5">
        <ModeToggle />
      </header>
      <main className="flex justify-center p-8">
        <Outlet />
      </main>
    </>
  );
}
