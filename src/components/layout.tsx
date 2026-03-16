import { Outlet } from 'react-router';

import { AppSidebar } from './app-sidebar';
import Footer from './footer';
import Header from './header';
import { SidebarInset, SidebarProvider } from './ui/sidebar';
import { TooltipProvider } from './ui/tooltip';

export default function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-neutral-50 shadow-md dark:bg-neutral-900">
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-10">
            <Outlet />
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
