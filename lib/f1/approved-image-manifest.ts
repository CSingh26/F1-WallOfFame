import type { ImageAsset } from "./types";

export const approvedImageManifest: ImageAsset[] = [];

export function getApprovedImage(entityId: string, kind?: ImageAsset["kind"]) {
  return approvedImageManifest.find(
    (asset) => asset.entityId === entityId && (!kind || asset.kind === kind),
  );
}
