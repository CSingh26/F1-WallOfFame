import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/f1/api";
import { entitiesQuerySchema } from "@/lib/f1/schemas";
import { getEntities } from "@/lib/f1/repository";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode");
  const parsed = entitiesQuerySchema.safeParse({ mode });
  if (!parsed.success) {
    return apiError(
      "invalid_mode",
      "Query param 'mode' must be 'driver' or 'team'.",
      400,
    );
  }

  try {
    const entities = getEntities(parsed.data.mode);
    return apiOk({ mode: parsed.data.mode, count: entities.length, entities });
  } catch {
    return apiError("entities_failed", "Unable to load entities.", 500);
  }
}
