import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Page from '@/app/page';
import Provider from './app/provider';
import { env } from './config';
import './index.css';
import { queryClient } from './lib/queryclient';

const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID;

const root = document.querySelector('#root');

createRoot(root!).render(
  <StrictMode>
    <Provider queryClient={queryClient} googleClientId={GOOGLE_CLIENT_ID}>
      <Page />
    </Provider>
  </StrictMode>
);
