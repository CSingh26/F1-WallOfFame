# F1 Heritage Explorer

A cinematic, publish-ready museum of Formula 1 history built with Next.js (App
Router), Three.js / React Three Fiber, Tailwind CSS, Zustand, TanStack Query,
Zod, and Upstash Vector. The experience lives at **`/f1-heritage`**.

## What it does

- **Two modes** — _Driver View_ and _Team View_, toggled with an animated tab.
- **Cinematic timeline** — every driver/constructor plotted by debut year along a
  horizontal track from **1950 → the current season**, with era bands behind the
  markers and a mobile-friendly decade list fallback.
- **Era bands** — nine chronological eras (Fangio era → ground-effect/turbo →
  Schumacher → hybrid → present) rendered as colored backdrops with labels.
- **Championship gold** — title-winning entities get a gold ring on the timeline
  and gold year pills in the placard.
- **Hover tooltips** — quick stats popovers on timeline markers.
- **Placard drawers** — a right-side drawer (desktop) / bottom sheet (mobile)
  with the entity visual, stats grid, championship strip, bio, and source badges.
  Escape closes it; it is a labelled dialog.
- **3D trophy rooms** — a low-poly _Driver Locker Room_ and _Team Factory Floor_
  built with React Three Fiber: rotating trophy pedestals (one per title year),
  helmet shelves, a race-suit mannequin, an abstract single-seater centerpiece,
  framed moments, team-color lighting, auto-orbit camera, and OrbitControls.
- **Semantic search** — a command palette (press `/`) querying Upstash Vector,
  with a deterministic local token-overlap fallback when vector search is not
  configured. The palette shows whether results came from "semantic" or "local".
- **Compare dock** — pin up to two entities for a side-by-side stat comparison.
- **Accessibility & responsiveness** — keyboard support, reduced-motion handling,
  WebGL detection with a 2D fallback wall, semantic landmarks, and alt text.

## Architecture

```
app/
  f1-heritage/         page.tsx (server) → F1HeritageApp (client), loading, error
  api/f1/              entities, entity/[mode]/[id], search, sync/*, images/manifest, health
components/f1-heritage/ Hero, Timeline, Placards, Search, CompareDock, 3D rooms
lib/f1/                types, schemas, env, seed data, clients, vector, repository
scripts/               seed-f1-data, index-f1-vector, validate-f1-data
docs/                  these documents
```

The data layer is **deterministic by default**: drivers, teams, artifacts, and
era bands come from in-memory seeds (`lib/f1/seed-*.ts`). Verified facts
(championship years, debut years, nationalities) are encoded; stats that cannot
be guaranteed accurate (wins, poles, podiums) are left `null` and rendered as
"Data syncing" rather than fabricated. Optional live enrichment is available via
the sync routes (see [F1 Data Sources](F1_DATA_SOURCES.md)).

## Local development

```bash
npm install
npm run dev          # http://localhost:3000/f1-heritage
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm run build
npm run validate:data   # integrity checks on the seed dataset
```

Optional data tooling:

```bash
npm run seed:data       # prints a summary of the bundled seed
npm run index:vector    # indexes entities/artifacts into Upstash Vector (skips if unconfigured)
```

## Environment variables

All variables are optional — the app runs fully on the deterministic seed with
none configured. See `.env.example`. Notable ones:

| Variable | Purpose |
| --- | --- |
| `UPSTASH_VECTOR_REST_URL` / `UPSTASH_VECTOR_REST_TOKEN` | Enables semantic search. Without them, local fallback search is used. |
| `JOLPICA_BASE_URL` / `OPENF1_BASE_URL` | Live data source base URLs for sync routes. |
| `SYNC_SECRET` | Bearer secret required to call `/api/f1/sync/*`. |
| `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_DEPLOYED_APP_URL` | App URLs for metadata/links. |

Secrets are never exposed to the client and never committed (`.env*` is
git-ignored). The app does not crash when any of them are missing.

## Asset policy

No copyrighted images are bundled. The approved-image manifest ships empty and
every visual falls back to a generated, stylized SVG/CSS motif. See
[F1 Asset Policy](F1_ASSET_POLICY.md).
