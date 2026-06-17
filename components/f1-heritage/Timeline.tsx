"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, GitCommitHorizontal } from "lucide-react";
import type { EraBand as EraBandType, HeritageEntity } from "@/lib/f1/types";
import { cn } from "@/lib/f1/utils";
import { TimelineTrack } from "./TimelineTrack";
import { EmptyState } from "./StateViews";

interface TimelineProps {
  entities: HeritageEntity[];
  eraBands: EraBandType[];
  startYear: number;
  endYear: number;
  onSelect: (entity: HeritageEntity) => void;
}

/**
 * Cinematic horizontal timeline on desktop; a mobile-friendly decade list on
 * small screens. Era bands sit behind markers plotted by debut year.
 */
export function Timeline({
  entities,
  eraBands,
  startYear,
  endYear,
  onSelect,
}: TimelineProps) {
  const [mobileView, setMobileView] = useState<"track" | "list">("list");

  if (entities.length === 0) {
    return (
      <EmptyState
        title="No entries on the timeline"
        message="Switch views or adjust your search to populate the timeline."
      />
    );
  }

  return (
    <section aria-label="Heritage timeline" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-heritage-ivory">
          The timeline · {startYear}–{endYear}
        </h2>
        <div className="flex items-center gap-1 sm:hidden" role="tablist" aria-label="Timeline layout">
          <button
            role="tab"
            aria-selected={mobileView === "list"}
            onClick={() => setMobileView("list")}
            className={cn(
              "rounded-lg p-2",
              mobileView === "list" ? "bg-heritage-panel text-heritage-ivory" : "text-heritage-muted",
            )}
            aria-label="Decade list view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            role="tab"
            aria-selected={mobileView === "track"}
            onClick={() => setMobileView("track")}
            className={cn(
              "rounded-lg p-2",
              mobileView === "track" ? "bg-heritage-panel text-heritage-ivory" : "text-heritage-muted",
            )}
            aria-label="Scrollable track view"
          >
            <GitCommitHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop / tablet: always the scrollable track */}
      <div className="hidden sm:block">
        <div className="heritage-scroll overflow-x-auto rounded-2xl border border-heritage-border bg-heritage-panel/30 p-4">
          <TimelineTrack
            entities={entities}
            eraBands={eraBands}
            startYear={startYear}
            endYear={endYear}
            onSelect={onSelect}
          />
        </div>
      </div>

      {/* Mobile: list by default, optional scroll track */}
      <div className="sm:hidden">
        {mobileView === "track" ? (
          <div className="heritage-scroll overflow-x-auto rounded-2xl border border-heritage-border bg-heritage-panel/30 p-4">
            <TimelineTrack
              entities={entities}
              eraBands={eraBands}
              startYear={startYear}
              endYear={endYear}
              onSelect={onSelect}
            />
          </div>
        ) : (
          <DecadeList entities={entities} onSelect={onSelect} />
        )}
      </div>
    </section>
  );
}

function DecadeList({
  entities,
  onSelect,
}: {
  entities: HeritageEntity[];
  onSelect: (entity: HeritageEntity) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<number, HeritageEntity[]>();
    for (const e of [...entities].sort((a, b) => a.debutYear - b.debutYear)) {
      const decade = Math.floor(e.debutYear / 10) * 10;
      const list = map.get(decade) ?? [];
      list.push(e);
      map.set(decade, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [entities]);

  return (
    <div className="space-y-4">
      {grouped.map(([decade, list]) => (
        <div key={decade}>
          <h3 className="mb-2 text-xs uppercase tracking-widest text-heritage-muted">
            {decade}s
          </h3>
          <ul className="space-y-2">
            {list.map((entity) => {
              const titles =
                entity.mode === "driver"
                  ? entity.totalChampionships
                  : entity.totalConstructorsChampionships;
              const title =
                entity.mode === "driver" ? entity.name : entity.constructorName;
              return (
                <li key={`${entity.mode}-${entity.id}`}>
                  <button
                    onClick={() => onSelect(entity)}
                    className="flex w-full items-center gap-3 rounded-xl border border-heritage-border bg-heritage-panel/40 px-3 py-2.5 text-left transition active:scale-[0.99]"
                  >
                    <span
                      className={cn(
                        "h-3 w-3 shrink-0 rounded-full",
                        titles > 0 && "ring-2 ring-heritage-gold/60",
                      )}
                      style={{ background: entity.primaryColor }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-heritage-ivory">
                        {title}
                      </span>
                      <span className="block truncate text-xs text-heritage-muted">
                        Debut {entity.debutYear} · {titles} title
                        {titles === 1 ? "" : "s"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
