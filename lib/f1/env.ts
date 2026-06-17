/**
 * Centralized, type-safe environment access.
 * Server-only secrets are NEVER read in client components — only the
 * NEXT_PUBLIC_* values are safe for the browser.
 */

const DEFAULT_JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1";
const DEFAULT_OPENF1_BASE_URL = "https://api.openf1.org/v1";
const FALLBACK_APP_URL = "http://localhost:3000";
const DEPLOYED_APP_URL =
  "https://f1-wall-of-fame-mzva79dx1-csingh26s-projects.vercel.app";

/** Public app URL — safe for client + server. */
export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_DEPLOYED_APP_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    FALLBACK_APP_URL
  );
}

export function getDeployedAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_DEPLOYED_APP_URL?.trim() || DEPLOYED_APP_URL
  );
}

export function getApprovedAssetBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_APPROVED_ASSET_BASE_URL?.trim() || null;
}

/** ---- Server-only accessors (do not import into client components) ---- */

export function getJolpicaBaseUrl(): string {
  return process.env.JOLPICA_BASE_URL?.trim() || DEFAULT_JOLPICA_BASE_URL;
}

export function getOpenF1BaseUrl(): string {
  return process.env.OPENF1_BASE_URL?.trim() || DEFAULT_OPENF1_BASE_URL;
}

export function getVectorConfig(): {
  url: string;
  token: string;
} | null {
  const url = process.env.UPSTASH_VECTOR_REST_URL?.trim();
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

export function isVectorConfigured(): boolean {
  return getVectorConfig() !== null;
}

export function getSyncSecret(): string | null {
  return process.env.SYNC_SECRET?.trim() || null;
}

export function isJolpicaConfigured(): boolean {
  return Boolean(process.env.JOLPICA_BASE_URL?.trim()) || true; // default exists
}

export function isOpenF1Configured(): boolean {
  return Boolean(process.env.OPENF1_BASE_URL?.trim()) || true; // default exists
}

export function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

export function getGooglePhotosConfig(): {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  allowedAlbumId: string | null;
} | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (!clientId || !clientSecret || !redirectUri) return null;
  return {
    clientId,
    clientSecret,
    redirectUri,
    allowedAlbumId: process.env.GOOGLE_PHOTOS_ALLOWED_ALBUM_ID?.trim() || null,
  };
}

export function isGooglePhotosConfigured(): boolean {
  return getGooglePhotosConfig() !== null;
}
