import Layout from '@/components/layout';
import { useRoutes, type RouteObject } from 'react-router';
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
    path: '*',
    Component: NotFoundPage,
  },
];

export default function Router() {
  return useRoutes(routes);
}
