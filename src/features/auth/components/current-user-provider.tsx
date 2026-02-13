import Loader from '@/components/loader';
import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { UserContext } from '../hooks';
import { useCurrentUserQuery } from '../queries';

type CurrentUserProviderProps = {
  children: ReactNode;
};

export default function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const { isLoading, isError, data: user } = useCurrentUserQuery();
  const { pathname } = useLocation();

  if (isLoading) return <Loader />;

  if (isError) return <Navigate to="/login" replace state={{ from: pathname }} />;

  const value = {
    user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
