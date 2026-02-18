import { LayoutDashboardIcon, TerminalIcon } from 'lucide-react';
import * as React from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { paths } from '../app/routes';
import { useCurrentUser } from '../features/auth/hooks';
import { useLogoutMutation } from '../features/auth/queries';
import Loader from './loader';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      {
        title: 'History',
        url: '#',
      },
      {
        title: 'Starred',
        url: '#',
      },
      {
        title: 'Settings',
        url: '#',
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUser();
  const { isPending: isLoggingOut, mutate: logout } = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: () => {
        navigate(paths.login, { replace: true });
      },
    });
  }, [logout, navigate]);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        {isLoggingOut ? (
          <Loader text="Logging out..." />
        ) : (
          user && <NavUser user={user} onLogout={handleLogout} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
