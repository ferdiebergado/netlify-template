import Layout from '@/components/layout';
import PublicLayout from '@/components/public-layout';
import { lazy } from 'react';
import { useRoutes, type RouteObject } from 'react-router';
import NotFoundPage from './pages/not-found-page';

const LoginPage = lazy(() => import('../features/auth/components/login-page'));
const Home = lazy(() => import('./pages/home'));

const routes: RouteObject[] = [
  {
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
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
    path: '*',
    Component: NotFoundPage,
  },
];

export default function Router() {
  return useRoutes(routes);
}
