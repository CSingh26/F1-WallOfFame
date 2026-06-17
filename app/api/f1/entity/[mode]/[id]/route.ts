import type { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/f1/api";
import { f1EntityModeSchema } from "@/lib/f1/schemas";
import { getEntity } from "@/lib/f1/repository";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: { mode: string; id: string } },
) {
  const modeParse = f1EntityModeSchema.safeParse(params.mode);
  if (!modeParse.success) {
    return apiError("invalid_mode", "Mode must be 'driver' or 'team'.", 400);
  }

  const id = params.id?.trim();
  if (!id) {
    return apiError("invalid_id", "Entity id is required.", 400);
  }

  const entity = getEntity(modeParse.data, id);
  if (!entity) {
    return apiError(
      "not_found",
      `No ${modeParse.data} found for '${id}'.`,
      404,
    );
  }

  return apiOk({ entity, artifacts: entity.artifacts });
}
