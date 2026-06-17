import type { NextRequest } from "next/server";
import { getSyncSecret } from "@/lib/f1/env";

/**
 * Constant-time-ish comparison of the provided secret against SYNC_SECRET.
 * Sync routes are unavailable unless SYNC_SECRET is configured AND the caller
 * presents it via `Authorization: Bearer <secret>` or `x-sync-secret` header.
 */
export function authorizeSync(request: NextRequest): {
  ok: boolean;
  reason?: "not_configured" | "unauthorized";
} {
  const secret = getSyncSecret();
  if (!secret) return { ok: false, reason: "not_configured" };

  const auth = request.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : null;
  const provided = bearer ?? request.headers.get("x-sync-secret")?.trim() ?? "";

  if (!provided || !timingSafeEqual(provided, secret)) {
    return { ok: false, reason: "unauthorized" };
  }
  return { ok: true };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
