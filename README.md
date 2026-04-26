# TalentBoard - Full-Stack Job Board

TalentBoard is a portfolio-ready job board built with React, Vite, Express, REST APIs, and MySQL. Employers can post and manage jobs, while candidates can browse, search, filter, and view job details.

## Features

- Responsive home page with hero search and featured jobs
- Browse jobs with keyword search and filters
- Filter by location, category, job type, and experience level
- Job details page with salary, requirements, and apply link
- Employer dashboard with create, edit, and delete workflows
- Frontend and backend validation
- Loading, empty, error, and 404 states
- MySQL schema and seed data included

## Tech Stack

- Frontend: React, Vite, React Router, plain CSS
- Backend: Node.js, Express, MySQL2
- Database: MySQL
- API style: REST
- Deployment: Vercel for frontend, Vercel serverless API or Render/Railway for backend

## Project Structure

```text
client/
  src/
    components/
    pages/
    services/
    styles/
server/
  api/
  config/
  controllers/
  middleware/
  models/
  routes/
database/
  schema.sql
  seed.sql
docs/
  project-brief.md
```

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

Or install each app separately:

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Create the MySQL database

Open MySQL and run:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

If you are already inside a MySQL shell, run:

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### 3. Configure environment variables

Copy `.env.example` into the apps:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Update `server/.env` with your local MySQL credentials.

### 4. Run locally

Start the backend:

```bash
npm run dev:server
```

Start the frontend in another terminal:

```bash
npm run dev:client
```

Open `http://localhost:5173`.

## Environment Variables

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Backend:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_board
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
```

Use `DB_SSL=true` for hosted MySQL providers that require TLS. Keep `DB_SSL_REJECT_UNAUTHORIZED=true` in production unless your provider specifically documents otherwise.

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | API health check |
| GET | `/jobs` | List jobs with optional filters |
| GET | `/jobs/:id` | Get one job |
| POST | `/jobs` | Create a job |
| PUT | `/jobs/:id` | Update a job |
| DELETE | `/jobs/:id` | Delete a job |

### Query Filters

`GET /api/jobs?search=react&location=Remote&category=Engineering&jobType=Full-time&experienceLevel=Mid%20Level&page=1&limit=6`

Supported filters:

- `search`
- `location`
- `category`
- `jobType`
- `experienceLevel`
- `featured`
- `page`
- `limit`

## Deployment

### Frontend on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Set the root directory to `client`.
4. Add `VITE_API_BASE_URL` with your deployed backend URL plus `/api`.
5. Deploy.

### Backend API on Vercel

The Express API is ready for Vercel serverless deployment through `server/api/index.js` and `server/vercel.json`. This works well for this stateless REST API.

1. Import the same GitHub repository in Vercel as a second project.
2. Set the root directory to `server`.
3. Framework preset: Other.
4. Install command: `npm install`
5. Build command: leave empty.
6. Add environment variables:
   - `CLIENT_URL`
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_SSL`
   - `DB_SSL_REJECT_UNAUTHORIZED`
7. Deploy and use the deployment URL plus `/api` as the frontend `VITE_API_BASE_URL`.

Use a separate backend host such as Render or Railway if you need long-running processes, WebSockets, background workers, or finer control over persistent database connections. For this portfolio REST API, Vercel serverless is enough.

### Backend API on Render or Railway

1. Create a new Node.js service from the same GitHub repository.
2. Set the root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the backend environment variables listed above.
6. Use a hosted MySQL database, then run `database/schema.sql` and `database/seed.sql`.

## Notes for Portfolio Presentation

- The app demonstrates real CRUD, REST API design, query filtering, reusable React components, backend validation, and MySQL modeling.
- The seed data makes the app presentable immediately after setup.
- The dashboard is intentionally simple so clients and reviewers can understand the workflow quickly.
