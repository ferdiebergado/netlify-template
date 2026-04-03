# Netlify Fullstack Template

A comprehensive full-stack TypeScript template for rapid application development with Netlify deployment.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

## Features

- **Authentication**: Google OAuth with session management
- **Database**: SQLite with LibSQL/Turso support
- **Responsive Design**: Mobile-first with dark mode support
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Declarative routing with React Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Testing**: Vitest unit tests with Playwright browser tests
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: Strict TypeScript throughout

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, shadcn/ui
- **Styling**: Tailwind CSS
- **Backend**: Netlify Functions & Edge Functions
- **Database**: SQLite (LibSQL/Turso)
- **Authentication**: Google OAuth 2.0
- **Validation**: Zod
- **Testing**: Vitest, Playwright
- **Deployment**: Netlify

## Quick Start

1. Clone the template:

**Web:**
[Create a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template)

**CLI:**

```bash
gh repo create netlify-app --template https://github.com/ferdiebergado/netlify-template --clone --public
cd netlify-app
```

2. Initialize the project:

```bash
npm run init
```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the required values:

- `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` for Google OAuth
- `TURSO_AUTH_TOKEN` if using Turso database

4. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:8888` to see your application.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run unit tests
- `npm run db` - Open SQLite database CLI
- `npm run create-db` - Create database from schema

### Database

The template uses SQLite with the following tables:

- `users`: Stores user information from Google OAuth
- `sessions`: Tracks user sessions with device information

To initialize the database:

```bash
npm run create-db
```

To interact with the database directly:

```bash
npm run db
```

The `npm run init` command automatically does this for you.

## Testing

Run all tests:

```bash
npm test
```

## Deployment

Deploy to Netlify:

1. Connect your GitHub repository to Netlify.
2. Add the required environment variables in Netlify dashboard.

The application follows Netlify's recommended practices for serverless functions and edge functions.

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
ENV=development
HOST=http://localhost:8888
DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=
GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=
VITE_APP_TITLE=Vite App
VITE_APP_HOST=http://localhost:8888
```

## Project Structure

```
.
├── api/                # Backend business logic
├── netlify/            # Netlify functions and edge functions
├── public/             # Static assets
├── shared/             # Shared code between frontend and backend
├── src/                # Frontend source code
│   ├── app/            # Application core
│   ├── components/     # React components
│   ├── features/       # Feature modules
│   └── lib/            # Utility functions
├── testing/            # Test helpers
├── init.sql            # Database schema
├── setup.sh            # Initialization script
└── vite.config.ts      # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
