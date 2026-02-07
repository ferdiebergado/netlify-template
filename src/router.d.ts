import { routes } from './routes';

declare module '@typeroute/router' {
  interface Register {
    routes: typeof routes;
  }
}
