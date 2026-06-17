"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import type { HeritageEntity } from "@/lib/f1/types";
import { cn } from "@/lib/f1/utils";
import { TimelineTooltip } from "./TimelineTooltip";

interface TimelineEntityMarkerProps {
  entity: HeritageEntity;
  startYear: number;
  totalYears: number;
  laneOffset: number;
  onSelect: (entity: HeritageEntity) => void;
}

/** A single dot on the timeline, positioned by debut year. */
export function TimelineEntityMarker({
  entity,
  startYear,
  totalYears,
  laneOffset,
  onSelect,
}: TimelineEntityMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const left = ((entity.debutYear - startYear) / totalYears) * 100;
  const isChampion =
    (entity.mode === "driver"
      ? entity.totalChampionships
      : entity.totalConstructorsChampionships) > 0;
  const title =
    entity.mode === "driver" ? entity.name : entity.constructorName;
  const titles =
    entity.mode === "driver"
      ? entity.totalChampionships
      : entity.totalConstructorsChampionships;

  return (
    <div
      className="absolute"
      style={{ left: `${left}%`, top: `${laneOffset}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative -translate-x-1/2">
        {hovered && <TimelineTooltip entity={entity} />}
        <button
          type="button"
          onClick={() => onSelect(entity)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={`${title}, debuted ${entity.debutYear}, ${titles} championship${titles === 1 ? "" : "s"}. Open details.`}
          className="group relative flex flex-col items-center gap-1"
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            {entity.active && (
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-pulse-ring"
                style={{ background: entity.primaryColor }}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border transition group-hover:scale-125",
                isChampion
                  ? "border-heritage-gold ring-2 ring-heritage-gold/50"
                  : "border-heritage-border",
              )}
              style={{ background: entity.primaryColor }}
            >
              {isChampion && (
                <Trophy className="h-2 w-2 text-heritage-bg" aria-hidden />
              )}
            </span>
          </span>
          <span className="max-w-[72px] truncate text-[10px] text-heritage-muted transition group-hover:text-heritage-ivory">
            {entity.mode === "driver" ? entity.familyName : title}
          </span>
        </button>
      </div>
    </div>
  );
}
