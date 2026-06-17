import { getEntity } from "@/lib/f1/repository";
import { modeSchema, routeIdSchema } from "@/lib/f1/schemas";
import { safeJsonError } from "@/lib/f1/utils";

export async function GET(
  _request: Request,
  context: { params: Promise<{ mode: string; id: string }> },
) {
  const params = await context.params;
  const mode = modeSchema.safeParse(params.mode);
  const id = routeIdSchema.safeParse(params.id);

  if (!mode.success) {
    return safeJsonError("invalid_mode", "Mode must be either driver or team.");
  }

  if (!id.success) {
    return safeJsonError("invalid_entity_id", "Entity id is invalid.");
  }

  const entity = getEntity(mode.data, id.data);

  if (!entity) {
    return safeJsonError("entity_not_found", "No matching F1 heritage entity was found.", 404);
  }

  return Response.json({ entity });
}
