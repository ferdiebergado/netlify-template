import { paths } from '@/app/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLogoutMutation } from '@/features/auth/queries';
import { BadgeCheckIcon, ChevronsUpDownIcon, LogOutIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { User } from 'shared/schemas/user.schema';
import { toast } from 'sonner';
import UserProfile from './user-profile';

type NavUserProps = {
  user: User;
};

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { mutate: logout } = useLogoutMutation();
  const navigate = useNavigate();

  const redirectToLogin = useCallback(() => {
    console.log('Redirecting to login page...');

    navigate(paths.login, { replace: true });
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout(undefined, {
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: () => {
        redirectToLogin();
      },
    });
  }, [logout, redirectToLogin]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
          >
            <UserProfile user={user} />
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserProfile user={user} />
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
