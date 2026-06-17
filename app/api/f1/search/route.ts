import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/f1/api";
import { searchRequestSchema } from "@/lib/f1/schemas";
import { searchEntities } from "@/lib/f1/repository";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("invalid_json", "Request body must be valid JSON.", 400);
  }

  const parsed = searchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "invalid_request",
      "Provide a non-empty 'query' and optional 'mode' (driver|team|all).",
      400,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const { results, usedVector } = await searchEntities(
      parsed.data.query,
      parsed.data.mode,
    );
    return apiOk({
      query: parsed.data.query,
      mode: parsed.data.mode,
      usedVector,
      count: results.length,
      results,
    });
  } catch {
    // Search must never hard-fail for the user.
    return apiError("search_failed", "Search is temporarily unavailable.", 503);
  }
}
