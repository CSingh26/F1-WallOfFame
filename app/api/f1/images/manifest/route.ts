import { approvedImageManifest } from "@/lib/f1/approved-image-manifest";

export async function GET() {
  return Response.json({
    images: approvedImageManifest.map((asset) => ({
      id: asset.id,
      entityId: asset.entityId,
      entityMode: asset.entityMode,
      kind: asset.kind,
      url: asset.url,
      alt: asset.alt,
      source: asset.source,
      licenseStatus: asset.licenseStatus,
      credit: asset.credit,
      width: asset.width,
      height: asset.height,
    })),
  });
}
