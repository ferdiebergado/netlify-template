import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import Page from '@/app/page';
import FatalErrorPage from './app/pages/fatal-error-page';
import Provider from './app/provider';
import config from './config';
import './index.css';
import { queryClient } from './lib/queryclient';

const root = document.querySelector('#root');

createRoot(root!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={FatalErrorPage}>
      <Provider queryClient={queryClient} googleClientId={config.googleClientId}>
        <Page />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);
