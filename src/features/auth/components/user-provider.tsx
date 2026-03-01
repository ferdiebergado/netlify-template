import FullPageLoader from '@/components/full-page-loader';
import { useUser } from '@clerk/clerk-react';
import type { User } from '@shared/schemas/user.schema';
import { type ReactNode } from 'react';
import { UserContext } from '../hooks';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: CurrentUserProviderProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <FullPageLoader />;

  const value = {
    user: {
      userId: user?.id,
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
    } as User,
    isAuthenticated: isSignedIn,
  };

  return <UserContext value={value}>{children}</UserContext>;
}
