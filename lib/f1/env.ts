import { JOLPICA_DEFAULT_BASE_URL, OPENF1_DEFAULT_BASE_URL } from "./constants";

function readEnv(key: string) {
  return process.env[key]?.trim() || "";
}

export function getServerEnv() {
  return {
    appUrl: readEnv("NEXT_PUBLIC_APP_URL") || readEnv("NEXT_PUBLIC_DEPLOYED_APP_URL"),
    deployedAppUrl: readEnv("NEXT_PUBLIC_DEPLOYED_APP_URL"),
    jolpicaBaseUrl: readEnv("JOLPICA_BASE_URL") || JOLPICA_DEFAULT_BASE_URL,
    openF1BaseUrl: readEnv("OPENF1_BASE_URL") || OPENF1_DEFAULT_BASE_URL,
    upstashVectorRestUrl: readEnv("UPSTASH_VECTOR_REST_URL"),
    upstashVectorRestToken: readEnv("UPSTASH_VECTOR_REST_TOKEN"),
    syncSecret: readEnv("SYNC_SECRET"),
    googlePhotosConfigured: Boolean(
      readEnv("GOOGLE_CLIENT_ID") &&
        readEnv("GOOGLE_CLIENT_SECRET") &&
        readEnv("GOOGLE_REDIRECT_URI") &&
        readEnv("GOOGLE_PHOTOS_ALLOWED_ALBUM_ID"),
    ),
    blobConfigured: Boolean(readEnv("BLOB_READ_WRITE_TOKEN")),
    approvedAssetBaseUrl: readEnv("NEXT_PUBLIC_APPROVED_ASSET_BASE_URL"),
  };
}

export function isVectorConfigured() {
  const env = getServerEnv();
  return Boolean(env.upstashVectorRestUrl && env.upstashVectorRestToken);
}

export function assertSyncSecret(value: string | null) {
  const expected = getServerEnv().syncSecret;
  return Boolean(expected && value && value === expected);
}
