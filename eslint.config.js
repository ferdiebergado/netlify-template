import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,

      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      ...pluginQuery.configs['flat/recommended'],

      eslintPluginUnicorn.configs.recommended,

      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/filename-case': 'off',
    },
  },
  {
    files: ['netlify/**/*.{ts,js}', 'api/**/*.{ts,js}', 'shared/**/*.{ts,js}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      eslintPluginUnicorn.configs.recommended,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',

      '@typescript-eslint/consistent-type-definitions': 'off',

      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/filename-case': 'off',
    },
  },
]);
