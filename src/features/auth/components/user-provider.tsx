import { useMemo, type ReactNode } from 'react';

import Loading from '@/components/loading';
import { UserContext } from '../hooks';
import { useMeQuery } from '../queries';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: CurrentUserProviderProps) {
  const { isLoading, data: profile } = useMeQuery();

  const value = useMemo(
    () => ({
      user: profile,
      isAuthenticated: !!profile,
    }),
    [profile]
  );

  if (isLoading) return <Loading />;

  return <UserContext value={value}>{children}</UserContext>;
}
