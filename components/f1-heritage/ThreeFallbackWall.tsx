import { Car, Frame, Shirt, Trophy } from "lucide-react";
import type { HydratedF1Entity, HeritageArtifact } from "@/lib/f1/types";
import { entityTitle } from "@/lib/f1/utils";

function iconForArtifact(artifact: HeritageArtifact) {
  if (artifact.type === "trophy") return Trophy;
  if (artifact.type === "car") return Car;
  if (artifact.type === "suit") return Shirt;
  return Frame;
}

export function ThreeFallbackWall({ entity }: { entity: HydratedF1Entity }) {
  return (
    <div className="grid min-h-[60vh] content-center gap-5 p-5">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-heritage-gold">
          2D artifact wall
        </div>
        <h3 className="mt-2 text-3xl font-semibold text-heritage-ivory">{entityTitle(entity)}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-heritage-muted">
          This fallback keeps the room available when WebGL is unavailable, reduced, or the screen
          is better suited to a lighter exhibit.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {entity.artifacts.map((artifact) => {
          const Icon = iconForArtifact(artifact);
          return (
            <article
              key={artifact.id}
              className="rounded-lg border border-heritage-border bg-black/40 p-4"
              style={{ borderColor: `${artifact.color}66` }}
            >
              <Icon className="h-6 w-6 text-heritage-gold" aria-hidden="true" />
              <h4 className="mt-4 text-lg font-semibold">{artifact.title}</h4>
              <p className="mt-2 text-sm leading-6 text-heritage-muted">{artifact.description}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
