import { route } from 'waymark';

const home = route('/').lazy(() => import('./Home'));
const notFound = route('/*').lazy(() => import('./components/NotFoundPage'));

export const routes = [home, notFound];
