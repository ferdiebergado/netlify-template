import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Page from '@/app/page';
import { ErrorBoundary } from 'react-error-boundary';
import FatalErrorPage from './app/pages/fatal-error-page';
import Provider from './app/provider';
import { env } from './config';
import './index.css';
import { queryClient } from './lib/queryclient';

const root = document.querySelector('#root');

createRoot(root!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={FatalErrorPage}>
      <Provider queryClient={queryClient} googleClientId={env.VITE_GOOGLE_CLIENT_ID}>
        <Page />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
