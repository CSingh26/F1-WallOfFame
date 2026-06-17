import { apiOk } from "@/lib/f1/api";
import {
  getAppUrl,
  isJolpicaConfigured,
  isOpenF1Configured,
  isVectorConfigured,
} from "@/lib/f1/env";
import { getStats } from "@/lib/f1/repository";

export const runtime = "nodejs";

/** Lightweight data-source health snapshot. Exposes no secrets. */
export async function GET() {
  let seedStatus: "ok" | "error" = "ok";
  let stats;
  try {
    stats = getStats();
  } catch {
    seedStatus = "error";
  }

  return apiOk({
    seed: seedStatus,
    jolpicaConfigured: isJolpicaConfigured(),
    openf1Configured: isOpenF1Configured(),
    vectorConfigured: isVectorConfigured(),
    appUrlPresent: Boolean(getAppUrl()),
    stats: stats ?? null,
  });
}
