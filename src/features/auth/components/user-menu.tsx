import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { UserButton, useUser } from '@clerk/clerk-react';

export function UserMenu() {
  const { user } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-3">
          <UserButton />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.fullName}</span>
            <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
