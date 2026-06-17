import { getServerEnv } from "./env";

type Query = Record<string, string | number | boolean | undefined>;

async function requestOpenF1<T>(path: string, query: Query = {}, attempt = 0): Promise<T[]> {
  const env = getServerEnv();
  const url = new URL(`${env.openF1BaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);

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
      next: { revalidate: 60 * 30 },
    });

    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 350 * 2 ** attempt));
      return requestOpenF1<T>(path, query, attempt + 1);
    }

    if (!response.ok) {
      throw new Error(`OpenF1 request failed with status ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload) ? (payload as T[]) : [];
  } finally {
    clearTimeout(timeout);
  }
}

export function fetchMeetings(query: Query = {}) {
  return requestOpenF1("meetings", query);
}

export function fetchSessions(query: Query = {}) {
  return requestOpenF1("sessions", query);
}

export function fetchDrivers(query: Query = {}) {
  return requestOpenF1("drivers", query);
}

export function fetchLaps(query: Query = {}) {
  return requestOpenF1("laps", query);
}

export function fetchStints(query: Query = {}) {
  return requestOpenF1("stints", query);
}

export function fetchPit(query: Query = {}) {
  return requestOpenF1("pit", query);
}

export function fetchRaceControl(query: Query = {}) {
  return requestOpenF1("race_control", query);
}

export function fetchPositions(query: Query = {}) {
  return requestOpenF1("position", query);
}
