import { routes } from './routes';

declare module 'waymark' {
  interface Register {
    routes: typeof routes;
  }
}
