# F1 Deployment

The app is a standard Next.js (App Router) project and deploys to **Vercel**.

## Prerequisites

- Node.js ≥ 18.18 (developed on Node 24).
- Vercel CLI (`npm i -g vercel`) authenticated to the target account.
- The project is linked to the Vercel project `f1-wall-of-fame`.

## Quality gates (run before deploying)

```bash
npm run lint
npm run typecheck
npm run validate:data
npm run build
```

All four must pass. The production build compiles the App Router routes, the
`/f1-heritage` experience (with the dynamically imported, client-only 3D rooms),
and the `/api/f1/*` routes.

## Environment variables on Vercel

None are required — the app runs on the deterministic seed. To enable optional
features, set these in the Vercel Project Settings (never commit them):

- `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN` — semantic search.
- `JOLPICA_BASE_URL`, `OPENF1_BASE_URL` — live data sources for sync routes.
- `SYNC_SECRET` — required to authorize `POST /api/f1/sync/*`.
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_DEPLOYED_APP_URL` — public URLs for metadata.

`.env`, `.env.local`, and `.vercel/` are git-ignored and must not be committed.

## Deploying with the Vercel CLI

```bash
# Build and create a preview deployment
vercel build
vercel deploy --prebuilt

# Promote to production
vercel deploy --prebuilt --prod
```

## Deployment URL

Production: <https://f1-wall-of-fame-mzva79dx1-csingh26s-projects.vercel.app>

After deploying, open `/f1-heritage` to verify the timeline, placards, search
palette (`/`), compare dock, and the 3D trophy rooms. On devices without WebGL or
on small screens, the rooms automatically render the accessible 2D fallback wall.

## Post-deploy checks

- `GET /api/f1/health` — confirm which data paths (seed/vector/sync) are active.
- Press `/` to open search; confirm the "semantic" vs "local" indicator matches
  whether Upstash Vector is configured.
- Toggle Driver/Team views and open a champion's placard → "Enter Trophy Room".
