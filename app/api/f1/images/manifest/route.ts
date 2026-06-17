import { apiOk } from "@/lib/f1/api";
import { listApprovedImageAssets } from "@/lib/f1/approved-image-manifest";

export const runtime = "nodejs";

/**
 * Returns ONLY approved image manifest entries. Never exposes secrets, pending
 * entries, or filesystem paths. Ships empty until the owner registers licensed
 * or self-owned media.
 */
export async function GET() {
  const images = listApprovedImageAssets();
  return apiOk({
    count: images.length,
    policy:
      "Only owner-approved licensed or self-owned media is served. No scraped or copyrighted imagery is included.",
    images,
  });
}
