import { lazy } from 'react';
import { type RouteObject } from 'react-router';

import PublicLayout from '@/components/public-layout';
import RequireGuest from '@/features/auth/components/require-guest';
import SigninPage from '@/features/auth/components/signin-page';

const Layout = lazy(() => import('@/components/layout'));
const SignupPage = lazy(() => import('@/features/auth/components/signup-page'));
const RequireUser = lazy(() => import('@/features/auth/components/require-user'));
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about'));
const Settings = lazy(() => import('./pages/settings'));
const NotFoundPage = lazy(() => import('./pages/not-found-page'));

export const paths = {
  signin: '/signin' as const,
  signup: '/signup' as const,
  about: '/about' as const,
  settings: '/settings' as const,
};

export const routes: RouteObject[] = [
  {
    Component: RequireGuest,
    children: [
      {
        Component: PublicLayout,
        children: [
          {
            path: paths.signin,
            Component: SigninPage,
          },
          {
            path: paths.signup,
            Component: SignupPage,
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
          {
            path: paths.about,
            Component: About,
          },
          {
            path: paths.settings,
            Component: Settings,
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
