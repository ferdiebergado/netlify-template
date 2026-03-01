import { UserButton } from '@clerk/clerk-react';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { useCurrentUser } from '../hooks';

export function UserMenu() {
  const { user } = useCurrentUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-3">
          <UserButton />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
