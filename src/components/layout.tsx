import { Outlet } from 'react-router';

import { AppSidebar } from './app-sidebar';
import Header from './header';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { TooltipProvider } from './ui/tooltip';

export default function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
