# F1 Heritage Explorer

F1 Heritage Explorer is a cinematic Formula 1 museum experience at `/f1-heritage`.

## Features

- Driver View and Team View.
- Timeline from 1950 through the current runtime year.
- Era bands, debut-year markers, gold championship highlights, and active-era pulses.
- Placard drawers for identity, biographies, source badges, artifacts, and stats.
- Compare dock for up to two drivers or constructors.
- Search through Upstash Vector when configured, with deterministic local fallback.
- React Three Fiber trophy room and factory floor with low-poly generated artifacts.
- Mobile and unavailable-WebGL fallback as a 2D artifact wall.

## Local Development

```bash
npm install
npm run dev
```

The app uses the Next.js App Router, TypeScript, Tailwind CSS, React, Three.js, React Three Fiber, Drei, Framer Motion, Zod, Zustand-ready dependencies, TanStack Query, Upstash Vector, Lucide React, clsx, and tailwind-merge.

## Routes

- `GET /f1-heritage`
- `GET /api/f1/entities?mode=driver|team`
- `GET /api/f1/entity/[mode]/[id]`
- `POST /api/f1/search`
- `POST /api/f1/sync/jolpica`
- `POST /api/f1/sync/openf1`
- `GET /api/f1/images/manifest`
- `GET /api/f1/health`

## Data Architecture

The app renders immediately from curated seed data in `lib/f1/seed-drivers.ts`, `lib/f1/seed-teams.ts`, and `lib/f1/seed-artifacts.ts`.

Exact mutable statistics are nullable where the seed archive should not guess. Protected sync routes can reach Jolpica and OpenF1, and the repository layer is prepared for persisted normalized sync storage.

## 3D Architecture

Three.js code is dynamically imported through `TrophyRoomShell`. The initial timeline is not blocked by R3F. Rooms use generated geometry only: floors, walls, trophy pedestals, helmets, suits, cars, framed moments, labels, lights, and OrbitControls.

## Fallback Behavior

Missing optional services do not crash the app:

- No Upstash Vector: local deterministic search.
- No approved images: generated fallback visuals.
- No WebGL or mobile viewport: 2D artifact wall.
- Jolpica/OpenF1 unavailable: seed archive remains available.
