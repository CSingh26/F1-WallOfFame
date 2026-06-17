import { getJolpicaBaseUrl } from "./env";
import { TTL, withCache } from "./cache";

/**
 * Typed Jolpica (Ergast-compatible) client.
 * - base URL from env with safe default
 * - timeout + retry with exponential backoff for 429 / 5xx
 * - never reads or transmits client-side secrets
 *
 * Jolpica is used through SYNC paths only — never on every page render.
 */

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;

interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
}

async function jolpicaFetch<T>(
  path: string,
  opts: FetchOptions = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retries = MAX_RETRIES } = opts;
  const base = getJolpicaBaseUrl().replace(/\/$/, "");
  const url = `${base}/${path.replace(/^\//, "")}`;

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      clearTimeout(timer);

      if (res.status === 429 || res.status >= 500) {
        throw new RetryableError(`Jolpica responded ${res.status}`);
      }
      if (!res.ok) {
        throw new Error(`Jolpica request failed: ${res.status}`);
      }
      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
      const retryable =
        error instanceof RetryableError ||
        (error instanceof Error && error.name === "AbortError");
      if (!retryable || attempt === retries) break;
      await backoff(attempt);
      attempt += 1;
    }
  }
  throw new Error(
    `Jolpica request to ${path} failed after ${attempt + 1} attempts: ${
      lastError instanceof Error ? lastError.message : "unknown error"
    }`,
  );
}

class RetryableError extends Error {}

function backoff(attempt: number): Promise<void> {
  const delay = Math.min(2 ** attempt * 250 + Math.random() * 100, 4_000);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/** ---- Pagination-aware MRData envelope ---- */
interface MRDataEnvelope<K extends string, V> {
  MRData: {
    total: string;
    limit: string;
    offset: string;
  } & Record<K, V>;
}

/** ---- Public typed endpoints (best-effort shapes) ---- */

export async function fetchSeasons(limit = 100): Promise<unknown[]> {
  return withCache(`jolpica:seasons:${limit}`, TTL.long, async () => {
    const data = await jolpicaFetch<
      MRDataEnvelope<"SeasonTable", { Seasons: unknown[] }>
    >(`seasons.json?limit=${limit}`);
    return data.MRData.SeasonTable?.Seasons ?? [];
  });
}

export async function fetchDrivers(season?: number): Promise<unknown[]> {
  const path = season ? `${season}/drivers.json?limit=100` : `drivers.json?limit=100`;
  return withCache(`jolpica:drivers:${season ?? "all"}`, TTL.long, async () => {
    const data = await jolpicaFetch<
      MRDataEnvelope<"DriverTable", { Drivers: unknown[] }>
    >(path);
    return data.MRData.DriverTable?.Drivers ?? [];
  });
}

export async function fetchConstructors(season?: number): Promise<unknown[]> {
  const path = season
    ? `${season}/constructors.json?limit=100`
    : `constructors.json?limit=100`;
  return withCache(
    `jolpica:constructors:${season ?? "all"}`,
    TTL.long,
    async () => {
      const data = await jolpicaFetch<
        MRDataEnvelope<"ConstructorTable", { Constructors: unknown[] }>
      >(path);
      return data.MRData.ConstructorTable?.Constructors ?? [];
    },
  );
}

export async function fetchRacesBySeason(season: number): Promise<unknown[]> {
  return withCache(`jolpica:races:${season}`, TTL.long, async () => {
    const data = await jolpicaFetch<
      MRDataEnvelope<"RaceTable", { Races: unknown[] }>
    >(`${season}.json?limit=100`);
    return data.MRData.RaceTable?.Races ?? [];
  });
}

export async function fetchDriverStandings(season: number): Promise<unknown[]> {
  return withCache(`jolpica:dstandings:${season}`, TTL.long, async () => {
    const data = await jolpicaFetch<
      MRDataEnvelope<"StandingsTable", { StandingsLists: unknown[] }>
    >(`${season}/driverStandings.json?limit=100`);
    return data.MRData.StandingsTable?.StandingsLists ?? [];
  });
}

export async function fetchConstructorStandings(
  season: number,
): Promise<unknown[]> {
  return withCache(`jolpica:cstandings:${season}`, TTL.long, async () => {
    const data = await jolpicaFetch<
      MRDataEnvelope<"StandingsTable", { StandingsLists: unknown[] }>
    >(`${season}/constructorStandings.json?limit=100`);
    return data.MRData.StandingsTable?.StandingsLists ?? [];
  });
}

export async function fetchRaceResults(
  season: number,
  round: number,
): Promise<unknown[]> {
  return withCache(
    `jolpica:results:${season}:${round}`,
    TTL.long,
    async () => {
      const data = await jolpicaFetch<
        MRDataEnvelope<"RaceTable", { Races: unknown[] }>
      >(`${season}/${round}/results.json?limit=100`);
      return data.MRData.RaceTable?.Races ?? [];
    },
  );
}

export async function fetchQualifyingResults(
  season: number,
  round: number,
): Promise<unknown[]> {
  return withCache(
    `jolpica:qualifying:${season}:${round}`,
    TTL.long,
    async () => {
      const data = await jolpicaFetch<
        MRDataEnvelope<"RaceTable", { Races: unknown[] }>
      >(`${season}/${round}/qualifying.json?limit=100`);
      return data.MRData.RaceTable?.Races ?? [];
    },
  );
}
