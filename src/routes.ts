import { route } from '@typeroute/router';
import Home from './Home';
import NotFoundPage from './pages/not-found-page';

const home = route('/').component(Home);
const notFound = route('/*').component(NotFoundPage);

export const routes = [home, notFound];
