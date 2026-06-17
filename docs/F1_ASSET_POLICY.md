# F1 Asset Policy

The F1 Heritage Explorer ships with a **strict no-copyrighted-asset policy**. It
does not bundle, fetch, or display copyrighted photographs, team logos, driver
likenesses, or trademarked liveries.

## Principles

1. **No copyrighted images are included.** The approved-image manifest
   (`lib/f1/approved-image-manifest.ts`) ships **empty**. Nothing is rendered
   from third-party image sources by default.
2. **Generated fallbacks only.** Every entity and artifact visual is produced by
   `lib/f1/image-provider.ts` + `components/f1-heritage/EntityVisual.tsx` as a
   stylized SVG/CSS motif (helmet, livery, trophy, car, moment, silhouette)
   derived deterministically from the entity's name and brand colors. No external
   asset is required for the experience to be complete.
3. **Explicit, auditable approval path.** If a properly licensed image is ever
   added, it must be registered in the approved manifest with an
   `licenseStatus: "approved"` entry and a credit. The data validator
   (`npm run validate:data`) fails the build if any image is marked `approved`
   without a matching manifest entry.
4. **Approved-only public surface.** `GET /api/f1/images/manifest` returns
   **only** approved assets, so unlicensed or pending material can never leak
   through the API.

## How fallbacks work

- `resolveImage` resolves in priority order: approved manifest → generated
  fallback. With an empty manifest, the generated fallback always wins.
- `fallbackVisual` returns a deterministic `{ background, accent, motif }` derived
  from a stable hash of the entity, so visuals are consistent across renders and
  require no network calls.
- Every visual carries descriptive **alt text** for accessibility, validated by
  the data checker.

## Optional licensed-image hooks (disabled by default)

The codebase contains _hooks_ — not active integrations — for Vercel Blob and a
Google Photos source (`getBlobToken`, `getGooglePhotosConfig`). These are inert
unless their environment variables are configured **and** corresponding approved
manifest entries are added. They exist so that a future operator with proper
rights can supply licensed media without code changes.

## Trademarks

Team and driver names are used descriptively for a historical/educational
heritage experience. No logos or trademarked marks are reproduced.
