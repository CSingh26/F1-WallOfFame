"use client";

import { useEffect } from "react";
import { DoorOpen, GitCompare, X } from "lucide-react";
import { DriverPlacard } from "./DriverPlacard";
import { TeamPlacard } from "./TeamPlacard";
import type { HydratedF1Entity } from "@/lib/f1/types";
import { cn, entityTitle } from "@/lib/f1/utils";

export function PlacardDrawer({
  entity,
  onClose,
  onEnterRoom,
  onCompare,
  compareDisabled,
}: {
  entity: HydratedF1Entity | null;
  onClose: () => void;
  onEnterRoom: (entity: HydratedF1Entity) => void;
  onCompare: (entity: HydratedF1Entity) => void;
  compareDisabled: boolean;
}) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    if (entity) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [entity, onClose]);

  if (!entity) {
    return null;
  }

  const title = entityTitle(entity);
  const sourceRefs = entity.sourceRefs.map((source) => source.replace("provider:", "").replace("seed:", ""));

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={`${title} placard`}>
      <button
        type="button"
        aria-label="Close placard backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <aside
        className={cn(
          "absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-lg border border-heritage-border bg-[#090909] p-5 shadow-museum",
          "md:bottom-4 md:left-auto md:right-4 md:top-4 md:w-[30rem] md:rounded-lg",
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-heritage-gold">
              {entity.mode === "driver" ? "Driver placard" : "Constructor placard"}
            </div>
            <h2 className="mt-2 text-3xl font-semibold text-heritage-ivory">{title}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {sourceRefs.map((source) => (
                <span
                  key={source}
                  className="rounded-full border border-heritage-border px-2 py-1 text-xs text-heritage-muted"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-heritage-border text-heritage-muted outline-none transition hover:bg-white/[0.06] hover:text-heritage-ivory focus-visible:ring-2 focus-visible:ring-heritage-gold"
            aria-label="Close placard"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {entity.mode === "driver" ? (
          <DriverPlacard entity={entity} />
        ) : (
          <TeamPlacard entity={entity} />
        )}

        <div className="sticky bottom-0 -mx-5 mt-6 grid gap-2 border-t border-heritage-border bg-[#090909]/95 p-5 backdrop-blur">
          <button
            type="button"
            onClick={() => onEnterRoom(entity)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-heritage-gold px-4 py-2 text-sm font-semibold text-black outline-none transition hover:bg-[#e4c678] focus-visible:ring-2 focus-visible:ring-heritage-gold"
          >
            <DoorOpen className="h-4 w-4" aria-hidden="true" />
            {entity.mode === "driver" ? "Enter Trophy Room" : "Enter Factory Floor"}
          </button>
          <button
            type="button"
            onClick={() => onCompare(entity)}
            disabled={compareDisabled}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-heritage-border px-4 py-2 text-sm font-semibold text-heritage-ivory outline-none transition hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-heritage-gold disabled:cursor-not-allowed disabled:opacity-45"
          >
            <GitCompare className="h-4 w-4" aria-hidden="true" />
            Add to Compare
          </button>
        </div>
      </aside>
    </div>
  );
}
