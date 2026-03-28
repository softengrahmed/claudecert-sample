# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack + Node.js compat)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest test suite
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Force reset database migrations
```

Run a single test file:
```bash
npx vitest run src/lib/__tests__/file-system.test.ts
```

## Architecture

**UIGen** is an AI-powered React component generator with live preview. Users describe components in natural language, Claude generates code, and it's previewed in-browser via a virtual file system.

### Key Data Flow

1. User sends message → `POST /api/chat` streams Claude response
2. Claude uses two tools: `str_replace_editor` (edit files) and `file_manager` (create/delete/rename)
3. Tool calls update the **virtual file system** (in-memory, no disk writes)
4. Preview panel compiles files with Babel in-browser and renders them
5. Authenticated users: project state (messages + files as JSON) persists to SQLite via Prisma

### State Management

Two React contexts in [src/lib/contexts/](src/lib/contexts/):
- **ChatContext** — messages, input state, submit handler, AI status
- **FileSystemContext** — virtual file system instance, tool call handler

### Core Modules

- [src/lib/file-system.ts](src/lib/file-system.ts) — Virtual file system (create/read/update/delete/rename), serializable for DB storage
- [src/lib/provider.ts](src/lib/provider.ts) — Language model provider; uses Claude Haiku 4.5 or mock fallback when no API key
- [src/lib/tools/](src/lib/tools/) — AI tool definitions (`str_replace_editor`, `file_manager`)
- [src/lib/prompts/](src/lib/prompts/) — System prompts instructing Claude to generate React components with Tailwind + App.jsx entry point
- [src/lib/transform/jsx-transformer.ts](src/lib/transform/jsx-transformer.ts) — In-browser JSX compilation via `@babel/standalone`
- [src/lib/auth.ts](src/lib/auth.ts) — JWT sessions (HTTP-only cookies, 7-day expiry, via `jose`)

### API & Server

- [src/app/api/chat/route.ts](src/app/api/chat/route.ts) — Streaming chat endpoint; uses Vercel AI SDK with ephemeral prompt caching
- [src/actions/](src/actions/) — Server Actions for auth (signUp/signIn/signOut) and project CRUD
- [src/middleware.ts](src/middleware.ts) — Route protection

### Database

Prisma + SQLite (`prisma/dev.db`). See [prisma/schema.prisma](prisma/schema.prisma) for the full schema. Run `npx prisma studio` to inspect.

### Environment Variables

- `ANTHROPIC_API_KEY` — Claude API key (falls back to mock provider if unset)
- `JWT_SECRET` — Defaults to `"development-secret-key"` if unset

### Testing

Tests are colocated in `__tests__/` directories alongside source files. Uses Vitest + jsdom + React Testing Library.

### Path Aliases

`@/*` maps to `./src/*` throughout the codebase.

## Code Style

Only comment complex or non-obvious logic. Do not add comments to self-explanatory code.
