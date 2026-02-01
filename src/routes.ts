import { lazy } from 'react';
import { route } from 'waymark';

const Home = lazy(() => import('./Home'));

const home = route('/').component(Home);

export const routes = [home];
