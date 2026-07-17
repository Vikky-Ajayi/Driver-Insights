# RideSpot

A full-stack mobile platform for discovering and navigating cycling routes.

## Stack
- **Mobile**: React Native + Expo (Expo Router, TanStack Query, Tailwind CSS)
- **API**: Express 5 + Drizzle ORM + Zod
- **Database**: PostgreSQL (Replit-managed, `DATABASE_URL` auto-provided)
- **Monorepo**: pnpm workspaces

## Project Structure
```
artifacts/
  mobile/          # Expo React Native app
  api-server/      # Express API server (port 8080)
  mockup-sandbox/  # Vite UI component previews
lib/
  db/              # Drizzle schema + migrations
  api-spec/        # OpenAPI spec + Orval generator
  api-client-react/ # Generated React Query hooks
  api-zod/         # Generated Zod schemas
```

## Running the Project
- **API Server**: starts automatically on port 8080
- **Mobile (Expo Go)**: starts automatically; scan the QR code shown in the `artifacts/mobile: expo` workflow logs with Expo Go on your phone

## Database
Schema lives in `lib/db/`. To push schema changes:
```
pnpm --filter @workspace/db run push
```

## User Preferences
- User wants to preview the mobile app via Expo Go (scan QR from workflow logs)
- User is using their own API database via Replit's managed PostgreSQL
