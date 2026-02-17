import { useMemo, type ReactNode } from 'react';

import FullPageLoader from '@/components/full-page-loader';
import { UserContext } from '../hooks';
import { useCurrentUserQuery } from '../queries';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: CurrentUserProviderProps) {
  const { isLoading, data: user } = useCurrentUserQuery();
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
    }),
    [user]
  );

  if (isLoading) return <FullPageLoader />;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
