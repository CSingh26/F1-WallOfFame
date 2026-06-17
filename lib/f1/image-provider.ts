import { getApprovedImage } from "./approved-image-manifest";
import type { F1EntityMode, ImageAsset, ImageKind } from "./types";

export function fallbackImageAsset(
  entityId: string,
  entityMode: F1EntityMode,
  label: string,
  kind: ImageKind = "fallback",
): ImageAsset {
  return {
    id: `${entityMode}-${entityId}-${kind}-fallback`,
    entityId,
    entityMode,
    kind,
    url: null,
    alt: `Stylized fallback visual for ${label}`,
    source: "fallback-generated",
    licenseStatus: "fallback",
    credit: "Generated in-app visual, no third-party media",
    width: 1200,
    height: 900,
  };
}

export function resolveImageAsset(
  entityId: string,
  entityMode: F1EntityMode,
  label: string,
  kind: ImageKind = "fallback",
): ImageAsset {
  return getApprovedImage(entityId, kind) ?? fallbackImageAsset(entityId, entityMode, label, kind);
}
