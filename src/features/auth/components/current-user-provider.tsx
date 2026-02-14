import { type ReactNode } from 'react';

import { UserContext } from '../hooks';
import { useCurrentUserQuery } from '../queries';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const { isLoading, data: user } = useCurrentUserQuery();

  const value = {
    user,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
