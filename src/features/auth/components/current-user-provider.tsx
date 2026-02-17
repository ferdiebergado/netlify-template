import { type ReactNode } from 'react';

import FullPageLoader from '@/components/full-page-loader';
import { UserContext } from '../hooks';
import { useCurrentUserQuery } from '../queries';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const { isLoading, data: user } = useCurrentUserQuery();

  if (isLoading) return <FullPageLoader />;

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
}
