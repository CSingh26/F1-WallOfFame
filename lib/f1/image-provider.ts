import { findApprovedEntry, resolveManifestUrl } from "./approved-image-manifest";
import type { F1EntityMode, ImageAsset, ImageKind } from "./types";

/**
 * Image resolution order (safe by default):
 *   1. Approved licensed image manifest
 *   2. Vercel Blob / approved public CDN URL (registered in the manifest)
 *   3. Google Photos user-authorized asset (only if OAuth configured later)
 *   4. Stylized generated fallback (always available)
 *
 * No copyrighted images are ever fetched or bundled. When nothing approved
 * exists, we return a `fallback-generated` asset with url=null; the UI renders
 * a stylized SVG/gradient visual from the entity's colors.
 */

export interface ResolveImageInput {
  entityId: string;
  entityMode: F1EntityMode;
  kind: ImageKind;
  alt: string;
  /** Colors used to seed the generated fallback. */
  primaryColor: string;
  secondaryColor: string;
}

export function resolveImage(input: ResolveImageInput): ImageAsset {
  const { entityId, entityMode, kind, alt } = input;

  // 1 + 2. Approved manifest (may itself point at a Blob / CDN URL)
  const approved = findApprovedEntry(entityMode, entityId, kind);
  if (approved) {
    return {
      id: `manifest-${approved.key}`,
      entityId,
      entityMode,
      kind,
      url: resolveManifestUrl(approved.url),
      alt: approved.alt || alt,
      source: "licensed-manifest",
      licenseStatus: "approved",
      credit: approved.credit,
      width: approved.width ?? null,
      height: approved.height ?? null,
    };
  }

  // 3. Google Photos integration is intentionally not wired here — only an
  //    abstraction exists. When configured later it would slot in above the
  //    fallback. We never expose secrets or fetch unauthorized media.

  // 4. Stylized generated fallback
  return buildFallbackAsset(input);
}

export function buildFallbackAsset(input: ResolveImageInput): ImageAsset {
  const { entityId, entityMode, kind, alt } = input;
  return {
    id: `fallback-${entityMode}-${entityId}-${kind}`,
    entityId,
    entityMode,
    kind: kind === "fallback" ? "fallback" : kind,
    url: null,
    alt,
    source: "fallback-generated",
    licenseStatus: "fallback",
    credit: "Stylized generated visual (no third-party imagery)",
    width: null,
    height: null,
  };
}

/**
 * Deterministic gradient/CSS descriptor for rendering a stylized fallback.
 * Pure data — consumed by client components to paint silhouettes/cards.
 */
export interface FallbackVisual {
  background: string;
  accent: string;
  motif: "silhouette" | "helmet" | "livery" | "trophy" | "car" | "moment";
}

export function fallbackVisual(
  kind: ImageKind,
  primaryColor: string,
  secondaryColor: string,
): FallbackVisual {
  const motifByKind: Record<ImageKind, FallbackVisual["motif"]> = {
    portrait: "silhouette",
    helmet: "helmet",
    "team-card": "livery",
    car: "car",
    suit: "silhouette",
    moment: "moment",
    fallback: "silhouette",
  };
  return {
    background: `linear-gradient(160deg, ${primaryColor} 0%, #0a0a0b 70%)`,
    accent: secondaryColor,
    motif: motifByKind[kind],
  };
}
