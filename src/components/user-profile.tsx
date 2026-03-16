import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUser } from '@/features/auth/hooks';
import { useSignoutMutation } from '@/features/auth/mutations';
import {
  Globe,
  LoaderIcon,
  LogOutIcon,
  Monitor,
  Smartphone,
  Tablet,
  UserCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import UserAvatar from './user-avatar';

interface DeviceSession {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'other';
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

// Mock data for demonstration - in a real app, this would come from an API
const mockSessions: DeviceSession[] = [
  {
    id: '1',
    deviceType: 'desktop',
    browser: 'Chrome on Windows',
    location: 'Manila, Philippines',
    lastActive: 'Just now',
    current: true,
  },
  {
    id: '2',
    deviceType: 'mobile',
    browser: 'Safari on iOS',
    location: 'Cebu, Philippines',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: '3',
    deviceType: 'desktop',
    browser: 'Firefox on macOS',
    location: 'Davao, Philippines',
    lastActive: '1 day ago',
    current: false,
  },
];

function getDeviceIcon(deviceType: DeviceSession['deviceType']) {
  switch (deviceType) {
    case 'desktop': {
      return <Monitor className="h-4 w-4" />;
    }
    case 'mobile': {
      return <Smartphone className="h-4 w-4" />;
    }
    case 'tablet': {
      return <Tablet className="h-4 w-4" />;
    }
    default: {
      return <Globe className="h-4 w-4" />;
    }
  }
}

export default function UserProfile() {
  const { user } = useCurrentUser();
  const { isPending, mutate: signout } = useSignoutMutation();

  const handleSignout = () => {
    signout(undefined, {
      onSuccess: ({ message }) => toast.success(message ?? 'Signed out successfully'),
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
        className="w-full bg-neutral-50 p-5 sm:max-w-md dark:bg-neutral-900"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-xl font-semibold">User Profile</SheetTitle>
          <SheetDescription>Manage your account information and active sessions</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* User Info Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserCircle className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <img src={user.picture || ''} className="h-25 w-25 rounded-full" />
              </div>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium wrap-break-word">{user.email || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devices Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSessions.map(session => (
                <div
                  key={session.id}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    session.current ? 'bg-muted' : ''
                  }`}
                >
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                    {getDeviceIcon(session.deviceType)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.browser}</p>
                    <p className="text-muted-foreground text-xs">
                      {session.location} • {session.lastActive}
                      {session.current && <span className="text-primary ml-1">(Current)</span>}
                    </p>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Sign out from this device</span>
                      <span className="text-destructive text-xs">×</span>
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="flex flex-col">
            <div className="flex-1"></div>
            {isPending ? (
              <Button variant="outline" size="lg" disabled>
                <LoaderIcon className="animate-spin" data-icon="inline-start" />
                Signing out...
              </Button>
            ) : (
              <Button variant="outline" size="lg" onClick={handleSignout}>
                <LogOutIcon data-icon="inline-start" />
                Signout
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
