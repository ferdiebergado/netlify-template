import Layout from '@/components/layout';
import PublicLayout from '@/components/public-layout';
import { lazy } from 'react';
import { useRoutes, type RouteObject } from 'react-router';
import AuthGuard from '../features/auth/components/auth-guard';
import NotFoundPage from './pages/not-found-page';

const LoginPage = lazy(() => import('../features/auth/components/login-page'));
const Home = lazy(() => import('./pages/home'));

const routes: RouteObject[] = [
  {
    Component: PublicLayout,
    children: [
      {
        path: '/login',
        Component: LoginPage,
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

export default function Router() {
  return useRoutes(routes);
}
