import Layout from '@/components/layout';
import PublicLayout from '@/components/public-layout';
import { useRoutes, type RouteObject } from 'react-router';
import LoginPage from '../features/auth/components/login-page';
import Home from './pages/home';
import NotFoundPage from './pages/not-found-page';

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
