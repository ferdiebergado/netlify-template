import { lazy } from 'react';
import { type RouteObject } from 'react-router';

import PublicLayout from '@/components/public-layout';
import LoginPage from '@/features/auth/components/login-page';
import RequireGuest from '@/features/auth/components/require-guest';

const Layout = lazy(() => import('@/components/layout'));
const RegistrationPage = lazy(() => import('@/features/auth/components/registration-page'));
const RequireUser = lazy(() => import('@/features/auth/components/require-user'));
const Home = lazy(() => import('./pages/home'));
const NotFoundPage = lazy(() => import('./pages/not-found-page'));

export const paths = {
  login: '/login' as const,
  register: '/register' as const,
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
          {
            path: paths.register,
            Component: RegistrationPage,
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
