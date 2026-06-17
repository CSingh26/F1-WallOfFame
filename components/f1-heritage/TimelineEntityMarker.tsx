"use client";

import { Trophy } from "lucide-react";
import { FIRST_F1_SEASON } from "@/lib/f1/constants";
import type { HydratedF1Entity } from "@/lib/f1/types";
import { cn, entityTitle } from "@/lib/f1/utils";
import { TimelineTooltip } from "./TimelineTooltip";

export function TimelineEntityMarker({
  entity,
  index,
  currentYear,
  selected,
  onSelect,
}: {
  entity: HydratedF1Entity;
  index: number;
  currentYear: number;
  selected: boolean;
  onSelect: (entity: HydratedF1Entity) => void;
}) {
  const left = ((entity.debutYear - FIRST_F1_SEASON) / (currentYear - FIRST_F1_SEASON)) * 100;
  const lane = index % 7;
  const hasTitle = entity.championshipYears.length > 0;
  const title = entityTitle(entity);

  return (
    <div
      className="group absolute"
      style={{
        left: `${left}%`,
        top: `${7.5 + lane * 3.7}rem`,
      }}
    >
      <TimelineTooltip entity={entity} />
      <button
        type="button"
        onClick={() => onSelect(entity)}
        aria-label={`${title}, debut ${entity.debutYear}. Open placard.`}
        className={cn(
          "relative flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-heritage-gold",
          hasTitle
            ? "border-heritage-gold bg-heritage-gold text-black shadow-glow"
            : "border-heritage-border bg-black text-heritage-ivory hover:border-heritage-gold",
          selected && "scale-110 ring-2 ring-heritage-red",
          entity.active && "after:absolute after:inset-[-0.32rem] after:rounded-full after:border after:border-heritage-red/50 after:content-[''] after:motion-safe:animate-pulse",
        )}
        style={{
          boxShadow: hasTitle ? `0 0 28px ${entity.primaryColor}55` : undefined,
        }}
      >
        {hasTitle ? <Trophy className="h-4 w-4" aria-hidden="true" /> : title.slice(0, 1)}
      </button>
      <div className="mt-2 w-28 -translate-x-1/2 truncate text-center text-xs text-heritage-muted">
        {title}
      </div>
    </div>
  );
}
