# F1 Asset Policy

This project does not commit or fetch copyrighted Formula 1 imagery.

## Not Allowed

- F1 official images.
- Driver portraits from F1.com.
- Team or constructor logos.
- Google Images results.
- Getty, Motorsport, or scraped third-party files.
- Wikipedia images unless license review is explicitly added later.

## Approved Manifest Workflow

Approved image entries belong in `lib/f1/approved-image-manifest.ts`.

Every image entry must include:

- id
- entity id and mode
- kind
- URL
- alt text
- source type
- license status
- optional credit
- dimensions when known

Only `licenseStatus: "approved"` entries should be served from the manifest.

## Fallback System

The default visuals are generated in-app:

- driver silhouette
- helmet card
- team livery card
- trophy, car, suit, and framed-moment displays

These are code-generated shapes and gradients, not downloaded assets.

## Google Photos

Google Photos OAuth is intentionally not implemented in this version. A future implementation must only serve user-authorized, self-owned, or licensed media and must not expose Google secrets to client components.
