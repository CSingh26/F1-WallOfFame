export const FIRST_F1_SEASON = 1950;

export const CURRENT_F1_YEAR = new Date().getFullYear();

export const F1_MODE_LABELS = {
  driver: "Driver View",
  team: "Team View",
} as const;

export const JOLPICA_DEFAULT_BASE_URL = "https://api.jolpi.ca/ergast/f1";

export const OPENF1_DEFAULT_BASE_URL = "https://api.openf1.org/v1";

export const SYNC_SECRET_HEADER = "x-sync-secret";

export const HERITAGE_SOURCE_REFS = {
  seed: "seed:curated-heritage",
  jolpica: "provider:jolpica",
  openf1: "provider:openf1",
  vector: "provider:upstash-vector",
} as const;
