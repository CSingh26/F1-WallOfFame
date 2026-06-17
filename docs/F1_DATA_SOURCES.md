# F1 Data Sources

The F1 Heritage Explorer is built around a **deterministic seed** with optional
**live enrichment**. This document describes where data comes from, how accuracy
is handled, and how the sync routes work.

## 1. Deterministic seed (default)

Source files:

- `lib/f1/seed-drivers.ts` — 18 drivers (Fangio → Norris).
- `lib/f1/seed-teams.ts` — 15 constructors (Ferrari → Haas).
- `lib/f1/seed-artifacts.ts` — trophies (one per championship year) and signature
  exhibits generated per entity.
- `lib/f1/constants.ts` — the nine era bands.

### Accuracy principles

- **Encoded facts** — championship years, debut years, nationalities, and team
  associations are real, verifiable facts.
- **No fabricated stats** — fields that cannot be guaranteed accurate without a
  live source (wins, poles, podiums, fastest laps, entries) are set to `null`.
  The UI renders these as **"Data syncing"** via `formatStat`, never as a guessed
  number.
- **Validation** — `npm run validate:data` enforces required fields, unique
  ids/slugs, championship-year ranges (`1950 … current season`), color formats,
  and image-license integrity.

## 2. Live enrichment (optional)

Two public, no-key data sources can enrich the seed at runtime:

| Source | Base URL (default) | Client | Used for |
| --- | --- | --- | --- |
| Jolpica (Ergast successor) | `https://api.jolpi.ca/ergast/f1` | `lib/f1/jolpica-client.ts` | Seasons, drivers, constructors, standings, results, qualifying |
| OpenF1 | `https://api.openf1.org/v1` | `lib/f1/openf1-client.ts` | Meetings, sessions, drivers, laps, stints, pit, race control, positions |

Both clients implement timeouts, retry with backoff, and in-memory TTL caching
(`lib/f1/cache.ts`). Normalizers in `lib/f1/data-normalizers.ts` map upstream
records onto the canonical domain types and apply patches to the seed.

### Sync routes

`POST /api/f1/sync/jolpica` and `POST /api/f1/sync/openf1` pull and normalize
live data. They are **protected by `SYNC_SECRET`** (`lib/f1/sync-auth.ts`), which
must be supplied via an `Authorization: Bearer <secret>` or `x-sync-secret`
header. Requests are compared using a timing-safe equality check. When
`SYNC_SECRET` is unset, the routes refuse to run.

## 3. Search data

`POST /api/f1/search` resolves queries through `lib/f1/repository.ts`:

1. If Upstash Vector is configured, `searchHeritage` performs semantic search.
2. Otherwise (or on any provider error), a deterministic local search using
   token-overlap scoring over a precomputed haystack is used.

The response indicates whether vector search was used so the UI can label
results as "semantic" or "local".

## 4. Health

`GET /api/f1/health` reports configuration/health for the seed, Jolpica, OpenF1,
and Upstash Vector, plus the computed stats summary — useful for verifying which
data paths are active in a given environment.
