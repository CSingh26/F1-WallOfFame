"use client";

import { CalendarClock } from "lucide-react";
import type { EraBand, F1EntityMode, HydratedF1Entity } from "@/lib/f1/types";
import { EmptyState } from "./EmptyState";
import { TimelineTrack } from "./TimelineTrack";

export function Timeline({
  mode,
  entities,
  eraBands,
  currentYear,
  selectedId,
  onSelect,
}: {
  mode: F1EntityMode;
  entities: HydratedF1Entity[];
  eraBands: EraBand[];
  currentYear: number;
  selectedId: string | null;
  onSelect: (entity: HydratedF1Entity) => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="timeline-title">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-heritage-gold">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Historical timeline
          </div>
          <h2 id="timeline-title" className="mt-2 text-3xl font-semibold text-heritage-ivory">
            {mode === "driver" ? "Driver debut archive" : "Constructor debut archive"}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-heritage-muted">
          Markers are plotted by debut year. Gold marks championship-winning legacies;
          active entities carry a subtle live-era pulse.
        </p>
      </div>

      {entities.length ? (
        <div className="overflow-x-auto pb-4">
          <TimelineTrack
            entities={entities}
            eraBands={eraBands}
            currentYear={currentYear}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <EmptyState title="No archive entries" message="The seed archive is empty for this mode." />
      )}
    </section>
  );
}
