# DomainGuard API — Spam Domain & Suspicious TLD Detection API

**A Node.js + TypeScript backend that detects spam domains/TLDs using a trie-backed in-memory detector, with MongoDB persistence, JWT auth, and Jest/Supertest tests.**

## Overview

This project provides a small, production-style API for:

- **Managing** a blacklist of spam domains and a set of suspicious TLDs (stored in MongoDB)
- **Detecting** whether an input domain (or email-domain) is spam using a fast, in-memory detector
- **Securing** endpoints with JWT authentication + basic role-based access control (RBAC)

Motivation: demonstrate a clean, testable backend with a real data-structure use case (Trie) and a practical API surface (auth + CRUD + detection).

## Features

- **Trie-based detection core**
  - Maintains an in-memory `SpamDetector` built from MongoDB data at startup
  - Uses a `Trie` (and reverse-domain technique) for fast lookups
- **Domain & TLD management**
  - Add/remove/check **spam domains**
  - Add/remove/check **suspicious TLDs**
  - Normalization helpers (lowercase, trim, remove trailing dot, strip `www.`)
- **Authentication & authorization**
  - JWT-based authentication (`Authorization: Bearer <token>`)
  - RBAC via `requireRole(["user" | "admin"])`
  - Protected endpoints + consistent 401/403 handling
- **Request validation**
  - Zod schemas validate request `body` / `params`
  - Standard error response shape on validation failures
- **Testing**
  - Unit tests for core logic (Trie + services + detector)
  - Integration tests for routes with `supertest`
  - MongoDB isolated via `mongodb-memory-server`
- **Logging**
  - Winston logger (silent in `test` environment)

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Web framework**: Express (`express@5`)
- **Database**: MongoDB
- **ODM**: Mongoose
- **Auth**: JWT (`jsonwebtoken`), password hashing (`bcryptjs`)
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest, ts-jest, Supertest, mongodb-memory-server

## Security:

- **Helmet for secure HTTP headers**
- **CORS protection**
- **Rate limiting to prevent brute force and DOS attacks**

## Installation & Setup

### Prerequisites

- Node.js (recommended: latest LTS)
- MongoDB running locally or accessible via a connection string

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)).

### Run in development

```bash
npm run dev
```

By default the API runs on **port 3000** (unless `PORT` is set).

## Usage

### Base URL

- **Local**: `http://localhost:<PORT>`

### Authentication (JWT)

After logging in (or registering), pass the token in:

- `Authorization: Bearer <token>`

### API Endpoints

#### Auth (`/api/auth`)

- `POST /api/auth/register` — create a user and return a JWT
- `POST /api/auth/login` — login and return a JWT
- `GET /api/auth/me` — get current user info (requires JWT)

Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"12345678"}'
```

Me:

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

#### Spam Domains (`/api/spam`)

Role rules:

- `GET /api/spam/check` — **user/admin**
- `POST /api/spam/create` — **admin only**
- `DELETE /api/spam/:id` — **admin only**

Check a domain:

```bash
curl -X GET http://localhost:3000/api/spam/check \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"domain":"click.xyz"}'
```

Add a spam domain (admin):

```bash
curl -X POST http://localhost:3000/api/spam/create \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"domain":"click.xyz"}'
```

Delete a spam domain (admin):

```bash
curl -X DELETE http://localhost:3000/api/spam/<spamId> \
  -H "Authorization: Bearer <admin-token>"
```

#### Suspicious TLDs (`/api/tld`)

Role rules:

- `GET /api/tld/check` — **user/admin**
- `POST /api/tld/create` — **admin only**
- `DELETE /api/tld/:id` — **admin only**

Check a domain’s TLD:

```bash
curl -X GET http://localhost:3000/api/tld/check \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"domain":"promo.xyz"}'
```

Add a suspicious TLD (admin):

```bash
curl -X POST http://localhost:3000/api/tld/create \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"tld":"xyz"}'
```

Delete a suspicious TLD (admin):

```bash
curl -X DELETE http://localhost:3000/api/tld/<tldId> \
  -H "Authorization: Bearer <admin-token>"
```

### Common responses

- **401**: missing/invalid token (`"Please login first"` / `"Invalid token"`)
- **403**: insufficient permissions (`"Forbidden"`)
- **400**: validation errors (`"Validation error"` + `errors` object)

## Testing

Run all tests:

```bash
npm test
```

### What’s covered

- **Unit tests** (`tests/unit`)
  - Trie data structure behavior
  - `SpamDetector` logic
  - Service-level behaviors (auth/spam/tld)
- **Integration tests** (`tests/integration`)
  - Express routes via `supertest`
  - Auth + RBAC flows (401/403)
  - Validation scenarios

### Test database

Tests run against an **ephemeral MongoDB** instance via `mongodb-memory-server` (configured in `tests/setup.ts`). Logging is silenced during tests.

## Architecture / Design

This codebase follows a pragmatic “clean architecture” style: routing/controllers are thin, services contain business logic, models encapsulate persistence, and core/domain logic is isolated.

### High-level module layout

```text
src/
  app.ts                 # Express app + route mounting
  server.ts              # Startup: connectDB -> initDetector -> listen
  config/                # dotenv + app configuration + DB connection
  middleware/            # JWT auth + RBAC + Zod validator
  modules/
    auth/                # user.controller/service/model/validation/routes
    spam/                # spam.controller/service/model/validation/routes
    tld/                 # tld.controller/service/model/validation/routes
  core/                  # SpamDetector (domain logic) + singleton instance
  ds/                    # Trie implementation
  utils/                 # JWT helpers, token extraction, normalization helpers
tests/
  setup.ts               # mongodb-memory-server + global test setup
  unit/                  # unit tests
  integration/           # API tests
```

### Detector design (why a Trie?)

- Stored data lives in MongoDB (`Spam` domains and `TLD`s)
- At startup, `initDetector()` builds an in-memory `SpamDetector` from DB records
- Domains are **normalized** and **reverse-domain inserted** into a trie
  - Example: `example.bad.com` → reverse: `com.bad.example`
  - This makes it easy to match consistent suffix patterns

## Environment Variables

These are read in `src/config/index.ts`:

- **`PORT`**: API port (default `3000`)
- **`NODE_ENV`**: environment name (default `"development"`; tests set `"test"`)
- **`LOG_LEVEL`**: winston log level (default `"info"`)
- **`MONGO_URL`**: MongoDB connection string (required in non-test usage)
- **`JWT_SECRET`**: JWT signing secret (required)
- **`JWT_SECRET_EXPIRY`**: token expiry (passed to `jsonwebtoken`, e.g. `1h`, `7d`)
- **`CORS_ORIGIN`**: Cors origin (default `*`)

Example `.env`:

```bash
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
MONGO_URL=mongodb://localhost:27017/trie-in-ts
JWT_SECRET=change-me
JWT_SECRET_EXPIRY=1h
```

## Contributing (Optional)

Contributions are welcome:

- Open an issue describing the change
- Submit a PR with clear description and relevant tests

## License

This project is currently unlicensed (default: `ISC` in `package.json`). Add a `LICENSE` file if you want to publish under a specific license (MIT/Apache-2.0/etc.).

## Author / Contact

- **Name**: Laith Alhalabi
- **GitHub**: [@Laeth234al](https://github.com/Laeth234al)
- **LinkedIn**: [laith-alhalabi-973329297](https://www.linkedin.com/in/laith-alhalabi-973329297/)
