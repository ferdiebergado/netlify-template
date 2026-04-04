/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

import { CSP_NONCE_PLACEHOLDER } from './shared/constants';

const alias = {
  '@': path.resolve(__dirname, './src'),
  '@api': path.resolve(__dirname, './api'),
  '@shared': path.resolve(__dirname, './shared'),
  '@testing': path.resolve(__dirname, './testing'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } }), tailwindcss()],
  resolve: {
    alias,
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['__tests__/unit/**/*.{test,spec}.ts'],
          alias,
          environment: 'node',
          setupFiles: ['setup.node.ts'],
          env: loadEnv('testing', process.cwd(), ''),
        },
      },
      {
        test: {
          name: 'browser',
          include: ['__tests__/component/**/*.{test,spec}.tsx'],
          alias,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['setup.browser.ts'],
        },
      },
    ],
  },
  html: {
    cspNonce: CSP_NONCE_PLACEHOLDER,
  },
});
