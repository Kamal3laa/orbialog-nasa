# ORBiALOG API

REST backend for the ORBiALOG NASA Space Apps 2026 project.

**Stack:** Node.js 20 · TypeScript (strict) · Express 4 · MongoDB Atlas · Mongoose · Zod · Pino

---

## Quick Start

```bash
cp .env.example .env        # fill in your Atlas URI + secrets
npm install
npm run seed                # load mock data into MongoDB Atlas
npm run dev                 # starts on http://localhost:4000
```

> **Atlas IP whitelist required** — go to Atlas → Network Access → Add Current IP before running seed.

---

## Available Endpoints  (`/api/v1`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/ready` | Readiness (checks DB) |
| GET | `/targets` | All planetary targets (`?planet=moon\|mars`) |
| GET | `/targets/:id` | Single target |
| GET | `/sites` | Analog sites with filter + search + pagination |
| GET | `/sites/:id` | Full site dossier |
| GET | `/disciplines` | Mission application domains |
| GET | `/disciplines/:id` | Single discipline |
| GET | `/methodology` | Methodology steps (ordered) |
| GET | `/comparison?target=&analog=` | Server-side fidelity scoring |
| POST | `/sandbox/query` | Simulated telemetry sandbox |

### Sites filter params
| Param | Values |
|-------|--------|
| `planet` | `all` · `moon` · `mars` · `egypt` |
| `category` | `hyper-arid` · `polar-desert` · `volcanic-basalt` · `impact-crater` · `evaporite-sabkha` · `sub-sea-level` |
| `q` | free-text search |
| `minSimilarity` | 0–100 |
| `sort` | `similarity` · `confidence` · `elevation` · `name` |
| `page` / `limit` | pagination (max 50) |

---

## Scripts

```bash
npm run dev        # tsx watch — hot reload
npm run build      # tsc → dist/
npm run start      # run compiled dist/server.js
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run seed       # upsert all mock data into Atlas
npm test           # vitest
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | — | `development` / `production` / `test` |
| `PORT` | — | default `4000` |
| `MONGODB_URI` | ✅ | Atlas SRV connection string |
| `JWT_ACCESS_SECRET` | ✅ | ≥ 32 random chars |
| `JWT_REFRESH_SECRET` | ✅ | ≥ 32 random chars |
| `CORS_ORIGINS` | — | comma-separated allowed origins |
| `LOG_LEVEL` | — | `info` by default |

---

## Project Structure

```
backend/
├── seed-data/          copies of frontend data files used for seeding
└── src/
    ├── app.ts          Express app (no listen) — testable
    ├── server.ts       listen + graceful shutdown
    ├── config/env.ts   Zod-validated env — crashes if invalid
    ├── db/connect.ts   Mongoose connect
    ├── models/         Mongoose schemas
    ├── middleware/     errorHandler, notFound
    ├── utils/          ApiError, asyncHandler, logger
    ├── scripts/seed.ts upsert all mock data (idempotent)
    └── modules/
        ├── health/
        ├── targets/
        ├── sites/
        ├── disciplines/
        ├── methodology/
        ├── comparison/   server-side fidelity scoring engine
        └── sandbox/      simulated telemetry endpoint
```
