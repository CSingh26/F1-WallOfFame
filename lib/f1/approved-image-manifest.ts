import type { F1EntityMode, ImageAsset, ImageKind } from "./types";

/**
 * Approved image manifest.
 *
 * This is the ONLY place licensed / self-owned image URLs may be registered.
 * It ships EMPTY by design — no copyrighted F1 imagery, team logos, driver
 * portraits, or scraped assets are bundled with this repository.
 *
 * The project owner may later add entries here (or serve them from an approved
 * CDN via NEXT_PUBLIC_APPROVED_ASSET_BASE_URL) pointing at media they own or
 * have explicit license to use. Until then the app uses stylized, generated
 * fallback visuals everywhere.
 *
 * Each entry MUST declare a real license status and a credit.
 */

export interface ApprovedImageEntry {
  /** Stable key: `${entityMode}:${entityId}:${kind}` */
  key: string;
  entityId: string;
  entityMode: F1EntityMode;
  kind: ImageKind;
  /** Absolute URL or a path relative to NEXT_PUBLIC_APPROVED_ASSET_BASE_URL. */
  url: string;
  alt: string;
  /** Must be "approved" to be served. "pending" entries are ignored. */
  licenseStatus: "approved" | "pending";
  credit: string;
  width?: number;
  height?: number;
}

export const APPROVED_IMAGE_MANIFEST: ApprovedImageEntry[] = [
  // Intentionally empty. Add only licensed / self-owned media here.
  // Example shape (do NOT add copyrighted assets):
  // {
  //   key: "driver:ayrton-senna:portrait",
  //   entityId: "ayrton-senna",
  //   entityMode: "driver",
  //   kind: "portrait",
  //   url: "/approved/senna-portrait.jpg",
  //   alt: "Portrait of a racing driver in period overalls",
  //   licenseStatus: "approved",
  //   credit: "Owner-provided licensed photograph",
  //   width: 800,
  //   height: 1000,
  // },
];

export function manifestKey(
  entityMode: F1EntityMode,
  entityId: string,
  kind: ImageKind,
): string {
  return `${entityMode}:${entityId}:${kind}`;
}

export function findApprovedEntry(
  entityMode: F1EntityMode,
  entityId: string,
  kind: ImageKind,
): ApprovedImageEntry | undefined {
  const key = manifestKey(entityMode, entityId, kind);
  return APPROVED_IMAGE_MANIFEST.find(
    (entry) => entry.key === key && entry.licenseStatus === "approved",
  );
}

/** Returns only approved entries, normalized for the public manifest API. */
export function listApprovedImageAssets(): ImageAsset[] {
  return APPROVED_IMAGE_MANIFEST.filter(
    (entry) => entry.licenseStatus === "approved",
  ).map((entry) => ({
    id: `manifest-${entry.key}`,
    entityId: entry.entityId,
    entityMode: entry.entityMode,
    kind: entry.kind,
    url: resolveManifestUrl(entry.url),
    alt: entry.alt,
    source: "licensed-manifest" as const,
    licenseStatus: "approved" as const,
    credit: entry.credit,
    width: entry.width ?? null,
    height: entry.height ?? null,
  }));
}

export function resolveManifestUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_APPROVED_ASSET_BASE_URL?.trim();
  if (base) {
    return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }
  return url; // local public path
}
