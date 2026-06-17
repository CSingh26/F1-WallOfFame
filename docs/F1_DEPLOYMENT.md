# F1 Deployment

Existing Vercel deployment URL:

https://f1-wall-of-fame-mzva79dx1-csingh26s-projects.vercel.app

## Local Checks

```bash
npm run validate:f1
npm run lint
npm run typecheck
npm run build
```

## Vercel Commands

```bash
vercel build
vercel deploy
vercel deploy --prod
```

## Environment Variables

Public:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_DEPLOYED_APP_URL`
- `NEXT_PUBLIC_APPROVED_ASSET_BASE_URL`

Server-only:

- `JOLPICA_BASE_URL`
- `OPENF1_BASE_URL`
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`
- `SYNC_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `BLOB_READ_WRITE_TOKEN`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_PHOTOS_ALLOWED_ALBUM_ID`

## Safety Rules

Do not commit:

- `.env`
- `.env.local`
- `.vercel`
- `node_modules`
- `.next`
- downloaded copyrighted imagery

The repository `.gitignore` covers these paths.

## Troubleshooting

- If Vector search is unavailable, the app falls back to local search.
- If sync providers fail, the seed archive remains available.
- If WebGL is unavailable or the viewport is mobile, the room opens as a 2D artifact wall.
- If Vercel auth fails, rerun `vercel login` and then repeat the deploy command.
