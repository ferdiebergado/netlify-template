import type { Profile } from '@shared/schemas/user.schema';
import { createContext, useContext } from 'react';

type UserContextValue = {
  user: Profile | null;
  isAuthenticated: boolean;
};

export const UserContext = createContext<UserContextValue | undefined>(undefined);

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) throw new Error('useCurrentUser must be used within UserProvider');

  return ctx;
}
