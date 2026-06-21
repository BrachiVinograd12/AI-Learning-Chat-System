# AI Learning Platform

Monorepo for an AI-powered learning platform with a Node.js/Express backend, Angular frontend, and shared TypeScript types.

## Project Structure

```
ai-learning-platform/
├── backend/          # Node.js + Express (Clean Architecture)
│   └── src/
│       ├── config/           # Environment & app configuration
│       ├── domain/           # Entities & repository interfaces
│       ├── application/      # Use cases & business logic
│       ├── infrastructure/   # DB, external services, repositories
│       └── presentation/     # Routes, controllers, middleware
├── frontend/         # Angular 17 (standalone components)
│   └── src/app/
│       ├── core/             # Singleton services, guards, interceptors
│       ├── shared/           # Reusable UI components
│       └── features/         # Feature modules (home, courses, chat)
├── shared/           # Shared TypeScript models & types
└── package.json      # npm workspaces root
```

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later

## Getting Started

### 1. Install dependencies

From the repository root:

```bash
npm install
```

This installs dependencies for all workspaces (`backend`, `frontend`, `shared`).

### 2. Build shared types

The backend and frontend depend on the shared package:

```bash
npm run build --workspace=shared
```

### 3. Configure the backend

Copy the example environment file and adjust if needed:

```bash
cp backend/.env.example backend/.env
```

Default values:

| Variable     | Default                  | Description              |
|-------------|--------------------------|--------------------------|
| `PORT`      | `3000`                   | Backend server port      |
| `NODE_ENV`  | `development`            | Environment              |
| `CORS_ORIGIN` | `http://localhost:4200` | Allowed frontend origin |

### 4. Run the backend

```bash
npm run dev:backend
```

The API will be available at `http://localhost:3000`.

**Endpoints:**

- `GET /api/health` — health check
- `GET /api/courses` — list courses
- `GET /api/courses/:id` — get course by ID

### 5. Run the frontend

In a separate terminal:

```bash
npm run dev:frontend
```

Open `http://localhost:4200` in your browser.

## Development Scripts

| Command              | Description                          |
|---------------------|--------------------------------------|
| `npm run dev:backend`  | Start backend with hot reload     |
| `npm run dev:frontend` | Start Angular dev server          |
| `npm run build:backend`| Compile backend TypeScript        |
| `npm run build:frontend`| Build Angular for production     |
| `npm run build`        | Build all workspaces              |

## Backend Architecture

The backend follows **Clean Architecture** layers:

1. **Domain** — core business entities and repository contracts (no external dependencies)
2. **Application** — use cases that orchestrate domain logic
3. **Infrastructure** — concrete implementations (database, APIs, file storage)
4. **Presentation** — HTTP layer (Express routes, controllers, middleware)

Dependencies flow inward: presentation → application → domain.

## Frontend Architecture

The Angular app uses:

- **Standalone components** (Angular 17+)
- **Lazy-loaded routes** for feature pages
- **`core/`** for app-wide services (e.g. `CourseService`)
- **`shared/`** for reusable UI (e.g. header)
- **`features/`** for page-level components (home, courses, chat)

## Shared Package

Import shared types in backend or frontend:

```typescript
import { Course, ApiResponse, ChatSession } from '@ai-learning/shared';
```

Rebuild shared after changing types:

```bash
npm run build --workspace=shared
```

## Next Steps

- Connect a real database in `backend/src/infrastructure/`
- Add authentication (JWT / OAuth)
- Integrate an AI provider for the chat feature
- Add unit and e2e tests
