import { useUser } from '@clerk/react-router';
import { type ReactNode } from 'react';

import FullPageLoader from '@/components/full-page-loader';
import type { User } from '@shared/schemas/user.schema';
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
