import { Outlet } from 'react-router';

import { ModeToggle } from '../features/dark-mode/components/mode-toggle';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { TooltipProvider } from './ui/tooltip';

export default function Layout() {
  return (
    <div className="bg-muted h-screen">
      <header className="p-5">
        <ModeToggle />
      </header>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex justify-center p-8">
            <SidebarTrigger />
            <Outlet />
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
