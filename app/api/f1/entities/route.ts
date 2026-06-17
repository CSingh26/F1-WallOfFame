import { modeSchema } from "@/lib/f1/schemas";
import { getEntities } from "@/lib/f1/repository";
import { safeJsonError } from "@/lib/f1/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = modeSchema.safeParse(searchParams.get("mode"));

  if (!parsed.success) {
    return safeJsonError("invalid_mode", "Mode must be either driver or team.");
  }

  return Response.json({
    mode: parsed.data,
    entities: getEntities(parsed.data),
  });
}
