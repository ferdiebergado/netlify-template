import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import pluginQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

const sharedExtends = [unicorn.configs.recommended, prettier];

const unicornRelaxedRules = {
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/no-anonymous-default-export': 'off',
  'unicorn/filename-case': 'off',
};

export default defineConfig([
  {
    ignores: ['dist'],
  },

  // =====================
  // Frontend (React)
  // =====================
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,

      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      ...pluginQuery.configs['flat/recommended'],

      ...sharedExtends,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: unicornRelaxedRules,
  },

  // =====================
  // Backend / tooling
  // =====================
  {
    files: ['netlify/**/*.{ts,js}', 'shared/**/*.{ts,js}', 'api/**/*.{ts,js}'],
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, ...sharedExtends],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...unicornRelaxedRules,

      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
]);
