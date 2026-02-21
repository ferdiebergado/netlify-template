import { lazy } from 'react';
import { type RouteObject } from 'react-router';

import Layout from '@/components/layout';
import PublicLayout from '@/components/public-layout';
import RequireGuest from '@/features/auth/components/require-guest';
import RequireUser from '../features/auth/components/require-user';

const LoginPage = lazy(() => import('../features/auth/components/login-page'));
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
            Component: LoginPage,
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
