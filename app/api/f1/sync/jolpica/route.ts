import {
  fetchConstructors,
  fetchDriverStandings,
  fetchDrivers,
  fetchSeasons,
} from "@/lib/f1/jolpica-client";
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
    const [seasons, drivers, constructors, latestDriverStandings] = await Promise.all([
      fetchSeasons(),
      fetchDrivers(),
      fetchConstructors(),
      fetchDriverStandings(new Date().getFullYear()).catch(() => []),
    ]);

    return Response.json({
      source: "jolpica",
      refreshed: false,
      message:
        "Provider reachable. This route is wired for protected refresh; seed data remains the source of truth until persisted sync storage is added.",
      summary: {
        seasons: seasons.length,
        drivers: drivers.length,
        constructors: constructors.length,
        latestDriverStandings: latestDriverStandings.length,
      },
    });
  } catch {
    return safeJsonError(
      "jolpica_unavailable",
      "Jolpica data could not be refreshed right now. Seed data remains available.",
      502,
    );
  }
}
