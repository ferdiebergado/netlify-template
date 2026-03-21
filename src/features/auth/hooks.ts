import type { Profile } from '@shared/schemas/user.schema';
import { createContext, useContext } from 'react';

type UserContextValue = {
  user: Profile | null;
  isAuthenticated: boolean;
};

// eslint-disable-next-line unicorn/no-null
export const UserContext = createContext<UserContextValue | null>(null);

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (ctx === null) throw new Error('useCurrentUser must be used within UserProvider');

  return ctx;
}
