import { LoaderIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUser } from '@/features/auth/hooks';
import { useDeviceSessions } from '@/features/auth/hooks/use-device-sessions';
import { useSignoutMutation } from '@/features/auth/mutations';
import { SessionList } from './session-list';
import UserAvatar from './user-avatar';
import { UserInfoCard } from './user-info-card';

export default function UserProfile() {
  const { user } = useCurrentUser();
  const { isLoading, isError, deviceSessions } = useDeviceSessions();
  const { isPending, mutate: signout } = useSignoutMutation();

  const handleSignout = () => {
    signout(undefined, {
      onSuccess: data => toast.success(data?.message ?? 'Signed out successfully.'),
    });
  };

  // eslint-disable-next-line unicorn/no-null
  if (!user) return null;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="rounded-full">
            <UserAvatar user={user} />
          </Button>
        }
      />
      <SheetContent
        side="right"
        className="flex w-full flex-col bg-neutral-50 p-5 sm:max-w-md dark:bg-neutral-900"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-semibold">User Profile</SheetTitle>
          <SheetDescription>Manage your account information and active sessions</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex-1">
          {/* User Info Section */}
          <UserInfoCard user={user} />

          {/* Devices Section */}
          <SessionList sessions={deviceSessions} isLoading={isLoading} isError={isError} />
        </div>

        <div className="mt-6">
          {isPending ? (
            <Button variant="outline" size="lg" disabled className="w-full">
              <LoaderIcon className="animate-spin" data-icon="inline-start" />
              Signing out...
            </Button>
          ) : (
            <Button variant="outline" size="lg" onClick={handleSignout} className="w-full">
              <LogOutIcon data-icon="inline-start" />
              Signout
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
