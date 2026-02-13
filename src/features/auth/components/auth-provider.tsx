import { useMemo, type ReactNode } from 'react';
import { AuthContext } from '../hooks';
import { useMeQuery } from '../queries';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, data: me } = useMeQuery();

  const value = useMemo(
    () => ({
      user: me,
      isLoading,
    }),
    [me, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
