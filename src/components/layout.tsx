import { Outlet } from 'react-router';

import { AppSidebar } from './app-sidebar';
import { SiteHeader } from './site-header';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { TooltipProvider } from './ui/tooltip';

export default function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
