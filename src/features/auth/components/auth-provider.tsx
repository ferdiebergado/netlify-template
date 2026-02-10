import { useMemo, type ReactNode } from 'react';
import { AuthContext } from '../context';
import { useMe } from '../hooks';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, data: me } = useMe();

  const value = useMemo(
    () => ({
      user: me,
      isLoading,
    }),
    [me, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
