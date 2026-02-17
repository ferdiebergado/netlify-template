import { lazy } from 'react';
import { type RouteObject } from 'react-router';

import Layout from '@/components/layout';
import PublicLayout from '@/components/public-layout';
import PublicGuard from '@/features/auth/components/public-guard';
import AuthGuard from '../features/auth/components/auth-guard';

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
    Component: PublicGuard,
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
    Component: AuthGuard,
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
