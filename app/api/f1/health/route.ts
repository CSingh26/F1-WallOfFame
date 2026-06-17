import { getProviderHealth } from "@/lib/f1/repository";

export async function GET() {
  return Response.json({
    status: "ok",
    health: getProviderHealth(),
  });
}
