# F1 Data Sources

## Jolpica

Jolpica is used for historical Formula 1 data with Ergast-compatible resources:

- seasons
- races
- drivers
- constructors
- results
- driver standings
- constructor standings
- qualifying where available

The client lives in `lib/f1/jolpica-client.ts`. It uses the `JOLPICA_BASE_URL` environment variable when present and falls back to `https://api.jolpi.ca/ergast/f1`.

## OpenF1

OpenF1 is used for modern enrichment, mainly 2023 onward:

- meetings
- sessions
- drivers
- laps
- stints
- pit data
- race control
- position data

The client lives in `lib/f1/openf1-client.ts`. It uses `OPENF1_BASE_URL` when present and falls back to `https://api.openf1.org/v1`.

## Sync Behavior

Sync routes are protected by `SYNC_SECRET`, accepted through `x-sync-secret` or a bearer token:

- `POST /api/f1/sync/jolpica`
- `POST /api/f1/sync/openf1`

They return summaries only and never expose tokens. The current implementation verifies provider reachability and keeps seed data as the deterministic source until persisted normalized storage is added.

## Search and Stats

Upstash Vector is only for discovery. Exact stats come from seed data and future normalized sync data, not vector similarity.

When `UPSTASH_VECTOR_REST_URL` and `UPSTASH_VECTOR_REST_TOKEN` are missing, `/api/f1/search` uses local deterministic matching.
