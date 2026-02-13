import { createContext, useContext } from 'react';
import type { User } from 'shared/schemas/user.schema';

type UserContextValue = {
  user?: User;
};

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useCurrentUser must be used within CurrentUserProvider');

  return ctx;
}
