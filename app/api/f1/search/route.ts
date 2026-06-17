import { searchBodySchema } from "@/lib/f1/schemas";
import { searchHeritage } from "@/lib/f1/vector";
import { safeJsonError } from "@/lib/f1/utils";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return safeJsonError("invalid_json", "Search body must be valid JSON.");
  }

  const parsed = searchBodySchema.safeParse(body);

  if (!parsed.success) {
    return safeJsonError("invalid_search", "Search requires a query and valid mode.", 422);
  }

  const result = await searchHeritage(parsed.data.query, parsed.data.mode);

  return Response.json(result);
}
