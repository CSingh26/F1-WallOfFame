import { fetchDrivers, fetchMeetings, fetchSessions } from "@/lib/f1/openf1-client";
import { assertSyncSecret } from "@/lib/f1/env";
import { SYNC_SECRET_HEADER } from "@/lib/f1/constants";
import { safeJsonError } from "@/lib/f1/utils";

function requestSecret(request: Request) {
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return request.headers.get(SYNC_SECRET_HEADER) ?? bearer ?? null;
}

export async function POST(request: Request) {
  if (!assertSyncSecret(requestSecret(request))) {
    return safeJsonError("unauthorized_sync", "A valid sync secret is required.", 401);
  }

  try {
    const currentYear = new Date().getFullYear();
    const [meetings, sessions, drivers] = await Promise.all([
      fetchMeetings({ year: currentYear }),
      fetchSessions({ year: currentYear }),
      fetchDrivers({ session_key: "latest" }).catch(() => []),
    ]);

    return Response.json({
      source: "openf1",
      refreshed: false,
      message:
        "Provider reachable. Modern enrichment is available through this protected route when persisted sync storage is added.",
      summary: {
        meetings: meetings.length,
        sessions: sessions.length,
        drivers: drivers.length,
      },
    });
  } catch {
    return safeJsonError(
      "openf1_unavailable",
      "OpenF1 enrichment could not be refreshed right now. Seed data remains available.",
      502,
    );
  }
}
