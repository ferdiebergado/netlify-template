import { LoaderIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUser } from '@/features/auth/hooks';
import { useSignoutMutation } from '@/features/auth/mutations';
import UserAvatar from './user-avatar';
import { UserInfoCard } from './user-info-card';

export default function UserProfile() {
  const { user } = useCurrentUser();
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
      <SheetContent className="bg-neutral-50 sm:max-w-md dark:bg-neutral-900">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">User Profile</SheetTitle>
          <SheetDescription>Manage your account information</SheetDescription>
        </SheetHeader>

        <div className="p-4">
          <UserInfoCard user={user} />
        </div>

        <SheetFooter>
          <Button onClick={handleSignout} disabled={isPending}>
            {isPending ? (
              <>
                <LoaderIcon className="animate-spin" data-icon="inline-start" />
                Signing out...
              </>
            ) : (
              <>
                <LogOutIcon data-icon="inline-start" />
                Signout
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
