import { useUser } from '@clerk/react-router';
import { type ReactNode } from 'react';

import Loading from '@/components/loading';
import type { User } from '@shared/schemas/user.schema';
import { UserContext } from '../hooks';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: CurrentUserProviderProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  const value = {
    user: {
      userId: user?.id,
      name: user?.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
    } as User,
    isAuthenticated: isSignedIn,
  };

  return (
    <UserContext value={value}>
      {children}
      {!isLoaded && <Loading />}
    </UserContext>
  );
}
