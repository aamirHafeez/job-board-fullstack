# AGENTS.md

Guidance for agents working in this repository.

## Project

This is a portfolio-ready full-stack job board.

- Frontend: React + Vite in `client/`
- Backend API: Node.js + Express in `server/`
- Database: MySQL setup files in `database/`

## Rules

- Do not commit `.env` files. Keep `.env`, `.env.local`, and other secret-bearing files out of git.
- Use environment variables for all secrets, database credentials, API URLs, and deployment-specific values.
- Preserve the existing local development commands unless the user explicitly asks to change them.
- Keep the frontend deployable on Vercel. The frontend app root is `client/`, and it should use `VITE_API_BASE_URL` for the backend URL.
- Keep the API production-ready: validate inputs, avoid leaking secrets in responses, use clear error handling, and keep CORS/env settings configurable.
- Keep code simple, modular, and beginner-readable. Prefer clear names and small files over clever abstractions.
- Do not rewrite unrelated files. Keep edits scoped to the task.
- After each task, report:
  - Files changed
  - Commands run
  - Results
  - Next commands
- Before the final answer, run the available build, lint, and syntax checks.

## Local Commands

From the repo root:

```bash
npm run install:all
npm run dev:server
npm run dev:client
npm run build:client
npm run start:server
```

From `client/`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

From `server/`:

```bash
npm run dev
npm start
```

## Checks

Use the checks that are available for the files touched:

```bash
npm run lint
npm run build
node --check app.js
node --check controllers/jobController.js
node --check models/jobModel.js
node --check routes/jobRoutes.js
node --check middleware/validateJob.js
node --check middleware/errorHandler.js
```

For production dependency checks:

```bash
npm audit --omit=dev
```

Run frontend checks from `client/` and backend checks from `server/`.
