import { Outlet } from 'react-router';
import { ModeToggle } from '../features/dark-mode/components/mode-toggle';

export default function Layout() {
  return (
    <div className="bg-muted min-h-screen">
      <header className="p-5">
        <ModeToggle />
      </header>
      <main className="flex justify-center p-8">
        <Outlet />
      </main>
    </div>
  );
}
