"use client";

import type { HeritageEntity } from "@/lib/f1/types";

interface TimelineTooltipProps {
  entity: HeritageEntity;
}

/** Compact quick-stats popover shown on marker hover/focus. */
export function TimelineTooltip({ entity }: TimelineTooltipProps) {
  const title =
    entity.mode === "driver" ? entity.name : entity.constructorName;
  const titles =
    entity.mode === "driver"
      ? entity.totalChampionships
      : entity.totalConstructorsChampionships;
  const span =
    entity.mode === "driver"
      ? entity.careerSpanLabel
      : entity.finalYear === null
        ? `${entity.debutYear}–present`
        : `${entity.debutYear}–${entity.finalYear}`;

  return (
    <div
      role="tooltip"
      className="heritage-glass pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-52 -translate-x-1/2 rounded-xl p-3 shadow-heritage-panel"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ background: entity.primaryColor }}
          aria-hidden
        />
        <p className="truncate font-display text-sm text-heritage-ivory">
          {title}
        </p>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
        <div>
          <dt className="text-heritage-muted">Titles</dt>
          <dd className="heritage-gold-text font-semibold">{titles}</dd>
        </div>
        <div>
          <dt className="text-heritage-muted">Active</dt>
          <dd className="text-heritage-ivory">{span}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-heritage-muted">Nationality</dt>
          <dd className="text-heritage-ivory">{entity.nationality}</dd>
        </div>
      </dl>
    </div>
  );
}
