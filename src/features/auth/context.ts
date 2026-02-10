import { createContext, useContext } from 'react';
import type { User } from 'shared/schemas/user.schema';

type AuthContextValue = {
  user?: User;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return ctx;
}
