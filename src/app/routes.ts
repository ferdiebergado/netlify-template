import { SignIn } from '@clerk/clerk-react';
import { lazy } from 'react';
import { type RouteObject } from 'react-router';

import PublicLayout from '@/components/public-layout';
import RequireGuest from '@/features/auth/components/require-guest';

const Layout = lazy(() => import('@/components/layout'));
const RequireUser = lazy(() => import('@/features/auth/components/require-user'));
const Home = lazy(() => import('./pages/home'));
const NotFoundPage = lazy(() => import('./pages/not-found-page'));

export const paths = {
  login: '/login' as const,
  me: '/me' as const,
  logout: '/logout' as const,
};

export const routes: RouteObject[] = [
  {
    Component: RequireGuest,
    children: [
      {
        Component: PublicLayout,
        children: [
          {
            path: paths.login,
            Component: SignIn,
          },
        ],
      },
    ],
  },
  {
    Component: RequireUser,
    children: [
      {
        Component: Layout,
        children: [
          {
            index: true,
            Component: Home,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    Component: NotFoundPage,
  },
];
