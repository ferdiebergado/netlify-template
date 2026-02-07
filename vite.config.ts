/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['netlify/**/*.{test,spec}.ts'],
          environment: 'node',
          setupFiles: ['setup.node.ts'],
        },
      },
      {
        test: {
          include: ['src/**/*.browser.{test,spec}.tsx'],
          name: 'browser',
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
