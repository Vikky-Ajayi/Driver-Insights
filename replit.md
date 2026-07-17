# RideSpot

A React Native (Expo) mobile app with an Express API backend for the RideSpot platform.

## Run & Operate

- **Mobile app**: workflow `artifacts/mobile: expo` — Expo dev server on port 18115
- **API server**: workflow `artifacts/api-server: API Server` — Express on port 8080
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `DATABASE_URL` — Postgres connection string (runtime-managed by Replit, no manual setup needed)

## Expo Go Preview

Scan the QR code shown in the `artifacts/mobile: expo` workflow logs with Expo Go on your phone.
The Metro bundler URL is exposed via `REPLIT_EXPO_DEV_DOMAIN`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
