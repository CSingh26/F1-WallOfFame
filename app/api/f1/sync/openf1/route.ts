import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/f1/api";
import { authorizeSync } from "@/lib/f1/sync-auth";
import { fetchMeetings, fetchSessions } from "@/lib/f1/openf1-client";
import { getCurrentSeasonYear } from "@/lib/f1/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Refreshes OpenF1 modern enrichment (mainly 2023+). Protected by SYNC_SECRET.
 * Returns only aggregate counts — never raw secrets or tokens.
 */
export async function POST(request: NextRequest) {
  const auth = authorizeSync(request);
  if (!auth.ok) {
    if (auth.reason === "not_configured") {
      return apiError(
        "sync_not_configured",
        "Sync is disabled because SYNC_SECRET is not set.",
        503,
      );
    }
    return apiError("unauthorized", "Valid sync credentials are required.", 401);
  }

  const year = getCurrentSeasonYear();
  try {
    const meetings = await fetchMeetings(year).catch(() => []);
    const firstMeetingKey =
      meetings.length > 0 ? Number(meetings[0]?.meeting_key) : undefined;
    const sessions = firstMeetingKey
      ? await fetchSessions(firstMeetingKey).catch(() => [])
      : [];

    return apiOk({
      source: "openf1",
      syncedAt: new Date().toISOString(),
      summary: {
        year,
        meetings: meetings.length,
        sampledSessions: sessions.length,
      },
    });
  } catch {
    return apiError(
      "openf1_unavailable",
      "OpenF1 enrichment is currently unavailable. Seed data remains active.",
      502,
    );
  }
}
