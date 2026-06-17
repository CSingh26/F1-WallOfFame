"use client";

import { GitCompare, X } from "lucide-react";
import { EntityStatGrid } from "./EntityStatGrid";
import type { HydratedF1Entity } from "@/lib/f1/types";
import { cn, entityTitle, formatStat } from "@/lib/f1/utils";

function compareStats(entity: HydratedF1Entity) {
  const titleCount =
    entity.mode === "driver" ? entity.totalChampionships : entity.totalConstructorsChampionships;
  const era = entity.mode === "driver" ? entity.primaryEra : entity.baseCountry;

  return [
    { label: "Titles", value: titleCount, tone: "gold" as const },
    { label: "Wins", value: formatStat(entity.wins) },
    { label: "Poles", value: formatStat(entity.poles) },
    { label: "Podiums", value: formatStat(entity.podiums) },
    {
      label: "Years",
      value: `${entity.debutYear}-${entity.active ? "present" : entity.finalYear ?? "syncing"}`,
    },
    { label: entity.mode === "driver" ? "Era" : "Base", value: era },
  ];
}

export function CompareDock({
  items,
  onRemove,
  onClear,
  onOpen,
}: {
  items: HydratedF1Entity[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onOpen: (entity: HydratedF1Entity) => void;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section
      aria-label="Compare dock"
      className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-lg border border-heritage-border bg-[#090909]/95 p-4 text-heritage-ivory shadow-museum backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <GitCompare className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          Compare archive
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-heritage-border text-heritage-muted outline-none transition hover:bg-white/[0.06] hover:text-heritage-ivory focus-visible:ring-2 focus-visible:ring-heritage-gold"
          aria-label="Clear compare dock"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className={cn("grid gap-4", items.length === 2 && "md:grid-cols-2")}>
        {items.map((entity) => (
          <article key={`${entity.mode}:${entity.id}`} className="rounded-md border border-heritage-border p-3">
            <div className="mb-3 flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onOpen(entity)}
                className="text-left outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold"
              >
                <div className="text-lg font-semibold">{entityTitle(entity)}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-heritage-muted">
                  {entity.mode}
                </div>
              </button>
              <button
                type="button"
                onClick={() => onRemove(`${entity.mode}:${entity.id}`)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-heritage-border text-heritage-muted outline-none transition hover:bg-white/[0.06] hover:text-heritage-ivory focus-visible:ring-2 focus-visible:ring-heritage-gold"
                aria-label={`Remove ${entityTitle(entity)} from compare`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <EntityStatGrid stats={compareStats(entity)} compact />
          </article>
        ))}
        {items.length === 1 ? (
          <div className="rounded-md border border-dashed border-heritage-border p-4 text-sm text-heritage-muted">
            Select one more driver or constructor placard to compare eras, titles, and synced
            stat fields.
          </div>
        ) : null}
      </div>
    </section>
  );
}
