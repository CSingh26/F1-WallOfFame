import { getOpenF1BaseUrl } from "./env";
import { TTL, withCache } from "./cache";

/**
 * Typed OpenF1 client for modern (2023+) enrichment.
 * - base URL from env with safe default
 * - timeout + retry for transient failures
 * - graceful fallback (returns [] on failure rather than throwing where used
 *   for enrichment); throws only from the low-level fetch so callers can decide
 */

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

async function openf1Fetch<T>(
  resource: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const base = getOpenF1BaseUrl().replace(/\/$/, "");
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  ).toString();
  const url = `${base}/${resource}${search ? `?${search}` : ""}`;

  let attempt = 0;
  let lastError: unknown;
  while (attempt <= MAX_RETRIES) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) {
        throw new Error(`OpenF1 responded ${res.status}`);
      }
      if (!res.ok) {
        throw new Error(`OpenF1 request failed: ${res.status}`);
      }
      return (await res.json()) as T;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;
      if (attempt === MAX_RETRIES) break;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 300));
      attempt += 1;
    }
  }
  throw new Error(
    `OpenF1 request to ${resource} failed: ${
      lastError instanceof Error ? lastError.message : "unknown error"
    }`,
  );
}

/** Resource shapes are intentionally loose; OpenF1 returns flat record arrays. */
export type OpenF1Record = Record<string, unknown>;

export async function fetchMeetings(year?: number): Promise<OpenF1Record[]> {
  const params: Record<string, string | number> =
    year !== undefined ? { year } : {};
  return withCache(`openf1:meetings:${year ?? "all"}`, TTL.long, () =>
    openf1Fetch<OpenF1Record[]>("meetings", params),
  );
}

export async function fetchSessions(
  meetingKey?: number,
): Promise<OpenF1Record[]> {
  const params: Record<string, string | number> =
    meetingKey !== undefined ? { meeting_key: meetingKey } : {};
  return withCache(`openf1:sessions:${meetingKey ?? "all"}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("sessions", params),
  );
}

export async function fetchDrivers(sessionKey?: number): Promise<OpenF1Record[]> {
  const params: Record<string, string | number> =
    sessionKey !== undefined ? { session_key: sessionKey } : {};
  return withCache(`openf1:drivers:${sessionKey ?? "all"}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("drivers", params),
  );
}

export async function fetchLaps(sessionKey: number): Promise<OpenF1Record[]> {
  return withCache(`openf1:laps:${sessionKey}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("laps", { session_key: sessionKey }),
  );
}

export async function fetchStints(sessionKey: number): Promise<OpenF1Record[]> {
  return withCache(`openf1:stints:${sessionKey}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("stints", { session_key: sessionKey }),
  );
}

export async function fetchPit(sessionKey: number): Promise<OpenF1Record[]> {
  return withCache(`openf1:pit:${sessionKey}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("pit", { session_key: sessionKey }),
  );
}

export async function fetchRaceControl(
  sessionKey: number,
): Promise<OpenF1Record[]> {
  return withCache(`openf1:racecontrol:${sessionKey}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("race_control", { session_key: sessionKey }),
  );
}

export async function fetchPositions(
  sessionKey: number,
): Promise<OpenF1Record[]> {
  return withCache(`openf1:positions:${sessionKey}`, TTL.medium, () =>
    openf1Fetch<OpenF1Record[]>("position", { session_key: sessionKey }),
  );
}
