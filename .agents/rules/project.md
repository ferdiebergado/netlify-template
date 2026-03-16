# Project Architecture

This is a React application with:

- Components in `/src/components`
- API routes in `/.netlify/functions`
- Server state management using react-query
- Components are based on shadcn-ui with base-ui
- Form management using react-hook-form with zod-resolver
- Validation using zod
- React-router in declarative mode
- Project scaffolded by vite

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

Backend server and deployment is on:

- Netlify with serverless and edge functions
