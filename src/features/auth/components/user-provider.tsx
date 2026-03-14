import { useMemo, type ReactNode } from 'react';

import { UserContext } from '../hooks';
import { useMeQuery } from '../queries';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function UserProvider({ children }: CurrentUserProviderProps) {
  const { data: user } = useMeQuery();

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
    }),
    [user]
  );

  return <UserContext value={value}>{children}</UserContext>;
}
