"use client";

import type { HeritageEntity, Artifact } from "@/lib/f1/types";

function artifactIcon(type: Artifact["type"]): string {
  switch (type) {
    case "trophy":
      return "🏆";
    case "helmet":
      return "🪖";
    case "suit":
      return "🧥";
    case "car":
      return "🏎️";
    case "framed_moment":
      return "🖼️";
    default:
      return "🎴";
  }
}

/**
 * Accessible 2D fallback for the 3D trophy room.
 * Used when WebGL is unavailable, on small screens, or with reduced motion.
 */
export function ThreeFallbackWall({ entity }: { entity: HeritageEntity }) {
  const title =
    entity.mode === "driver" ? entity.name : entity.constructorName;
  const artifacts = entity.artifacts;

  return (
    <div className="heritage-scroll h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <div
          className="mb-6 rounded-2xl border border-heritage-border p-6"
          style={{
            background: `linear-gradient(135deg, ${entity.primaryColor}22, transparent)`,
          }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-heritage-muted">
            {entity.mode === "driver" ? "Trophy room" : "Factory floor"}
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-heritage-ivory">
            {title}
          </h3>
          <p className="mt-1 text-sm text-heritage-muted">
            A 2D exhibit view. {artifacts.length} artifacts on display.
          </p>
        </div>

        {artifacts.length === 0 ? (
          <p className="text-sm text-heritage-muted">
            Exhibits are syncing. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((a) => (
              <li
                key={a.id}
                className="rounded-xl border border-heritage-border bg-heritage-panel/60 p-4"
                style={
                  a.importance === "legendary"
                    ? { borderColor: "var(--heritage-gold)" }
                    : undefined
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl" aria-hidden>
                    {artifactIcon(a.type)}
                  </span>
                  {a.year ? (
                    <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs text-heritage-gold">
                      {a.year}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-medium text-heritage-ivory">
                  {a.title}
                </p>
                <p className="mt-1 text-xs text-heritage-muted">
                  {a.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
