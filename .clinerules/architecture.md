# Project Architecture

This is a React single-page application with:

- Components in `/src/components`
- API routes in `/.netlify/functions`
- backend in `/api`
- database schea is in `/init.sql`
- Server state management using react-query
- Components are based on shadcn-ui with base-ui
- Form management using react-hook-form with zod-resolver
- validation using zod
- react-router in declarative mode for page navigation
- react-query for server state management
- project scaffolded with vite
- vitest as testing framework with playwright as driver in browser mode

## Coding Standards

- Use TypeScript for all new files
- Follow the existing naming conventions

## External Dependencies

Our authentication system uses Google Oauth based on:

- react-oauth-google
- google-auth-library

The database is based on:

- sqlite
- libsql provided by turso

Backend server and deployment is in:

- Netlify with serverless and edge functions
