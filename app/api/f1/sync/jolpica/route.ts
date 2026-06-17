import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/f1/api";
import { authorizeSync } from "@/lib/f1/sync-auth";
import {
  fetchConstructors,
  fetchDrivers,
  fetchSeasons,
} from "@/lib/f1/jolpica-client";
import {
  normalizeJolpicaConstructor,
  normalizeJolpicaDriver,
} from "@/lib/f1/data-normalizers";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Refreshes Jolpica (Ergast-compatible) reference data. Protected by
 * SYNC_SECRET. Returns only aggregate counts — never raw secrets or tokens.
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

  try {
    const [seasons, drivers, constructors] = await Promise.all([
      fetchSeasons().catch(() => []),
      fetchDrivers().catch(() => []),
      fetchConstructors().catch(() => []),
    ]);

    const normalizedDrivers = drivers
      .map(normalizeJolpicaDriver)
      .filter(Boolean);
    const normalizedConstructors = constructors
      .map(normalizeJolpicaConstructor)
      .filter(Boolean);

    return apiOk({
      source: "jolpica",
      syncedAt: new Date().toISOString(),
      summary: {
        seasons: seasons.length,
        drivers: drivers.length,
        constructors: constructors.length,
        normalizedDrivers: normalizedDrivers.length,
        normalizedConstructors: normalizedConstructors.length,
      },
    });
  } catch {
    return apiError(
      "jolpica_unavailable",
      "Jolpica data source is currently unavailable. Seed data remains active.",
      502,
    );
  }
}
