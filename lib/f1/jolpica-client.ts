import { getServerEnv } from "./env";

type Query = Record<string, string | number | boolean | undefined>;

async function requestJolpica<T>(path: string, query: Query = {}, attempt = 0): Promise<T> {
  const env = getServerEnv();
  const url = new URL(`${env.jolpicaBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value !== "undefined") {
      url.searchParams.set(key, String(value));
    }
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
      next: { revalidate: 60 * 60 * 12 },
    });

    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 350 * 2 ** attempt));
      return requestJolpica<T>(path, query, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(`Jolpica request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function table<T = unknown>(payload: unknown, tableName: string): T[] {
  const data = payload as {
    MRData?: Record<string, unknown>;
  };
  const mrData = data.MRData;

  if (!mrData) {
    return [];
  }

  const container = Object.values(mrData).find(
    (value): value is Record<string, unknown> =>
      typeof value === "object" && value !== null && tableName in value,
  );

  const rows = container?.[tableName];
  return Array.isArray(rows) ? (rows as T[]) : [];
}

export async function fetchSeasons() {
  const payload = await requestJolpica<unknown>("seasons", { limit: 200 });
  return table(payload, "Seasons");
}

export async function fetchDrivers() {
  const payload = await requestJolpica<unknown>("drivers", { limit: 2000 });
  return table(payload, "Drivers");
}

export async function fetchConstructors() {
  const payload = await requestJolpica<unknown>("constructors", { limit: 2000 });
  return table(payload, "Constructors");
}

export async function fetchRacesBySeason(season: number) {
  const payload = await requestJolpica<unknown>(`${season}/races`, { limit: 100 });
  return table(payload, "Races");
}

export async function fetchDriverStandings(season: number) {
  const payload = await requestJolpica<unknown>(`${season}/driverstandings`, { limit: 200 });
  return table(payload, "StandingsLists");
}

export async function fetchConstructorStandings(season: number) {
  const payload = await requestJolpica<unknown>(`${season}/constructorstandings`, { limit: 200 });
  return table(payload, "StandingsLists");
}

export async function fetchRaceResults(season: number, round: number | string) {
  const payload = await requestJolpica<unknown>(`${season}/${round}/results`, { limit: 200 });
  return table(payload, "Races");
}

export async function fetchQualifyingResults(season: number, round: number | string) {
  const payload = await requestJolpica<unknown>(`${season}/${round}/qualifying`, { limit: 200 });
  return table(payload, "Races");
}
