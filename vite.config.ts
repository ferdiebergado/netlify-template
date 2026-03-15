/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vite';

const alias = {
  '@': path.resolve(__dirname, './src'),
  '@api': path.resolve(__dirname, './api'),
  '@shared': path.resolve(__dirname, './shared'),
  '@testing': path.resolve(__dirname, './testing'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias,
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['api/**/*.{test,spec}.ts'],
          alias,
          environment: 'node',
          setupFiles: ['setup.node.ts'],
        },
      },
      {
        test: {
          name: 'browser',
          include: ['src/**/*.{test,spec}.tsx'],
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
});
