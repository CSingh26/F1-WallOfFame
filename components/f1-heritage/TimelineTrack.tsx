"use client";

import { useMemo } from "react";
import type { EraBand as EraBandType, HeritageEntity } from "@/lib/f1/types";
import { EraBand } from "./EraBand";
import { TimelineEntityMarker } from "./TimelineEntityMarker";

interface TimelineTrackProps {
  entities: HeritageEntity[];
  eraBands: EraBandType[];
  startYear: number;
  endYear: number;
  onSelect: (entity: HeritageEntity) => void;
}

const LANE_HEIGHT = 56;
const LANE_COUNT = 6;

/** The scrollable inner track that lays out era bands, year ticks, and markers. */
export function TimelineTrack({
  entities,
  eraBands,
  startYear,
  endYear,
  onSelect,
}: TimelineTrackProps) {
  const totalYears = endYear - startYear + 1;

  // Assign markers to lanes to reduce overlap, ordered by debut year.
  const placed = useMemo(() => {
    const sorted = [...entities].sort((a, b) => a.debutYear - b.debutYear);
    const laneLastLeft: number[] = new Array(LANE_COUNT).fill(-Infinity);
    return sorted.map((entity) => {
      const left = ((entity.debutYear - startYear) / totalYears) * 100;
      let lane = 0;
      for (let i = 0; i < LANE_COUNT; i++) {
        if (left - laneLastLeft[i] > 5) {
          lane = i;
          break;
        }
        lane = (i + 1) % LANE_COUNT;
      }
      laneLastLeft[lane] = left;
      return { entity, lane };
    });
  }, [entities, startYear, totalYears]);

  const yearTicks = useMemo(() => {
    const ticks: number[] = [];
    for (let y = startYear; y <= endYear; y += 10) ticks.push(y);
    if (ticks[ticks.length - 1] !== endYear) ticks.push(endYear);
    return ticks;
  }, [startYear, endYear]);

  return (
    <div
      className="relative min-w-[1100px]"
      style={{ height: `${LANE_COUNT * LANE_HEIGHT + 96}px` }}
    >
      {/* Era bands */}
      <div className="absolute inset-x-0 top-0 bottom-12">
        {eraBands.map((band) => (
          <EraBand
            key={band.id}
            band={band}
            startYear={startYear}
            endYear={endYear}
            totalYears={totalYears}
          />
        ))}
      </div>

      {/* Center racing line */}
      <div
        className="absolute inset-x-0"
        style={{ top: `${(LANE_COUNT * LANE_HEIGHT) / 2 + 28}px` }}
      >
        <div className="heritage-divider" />
      </div>

      {/* Markers */}
      <div className="absolute inset-x-0 top-7">
        {placed.map(({ entity, lane }) => (
          <TimelineEntityMarker
            key={`${entity.mode}-${entity.id}`}
            entity={entity}
            startYear={startYear}
            totalYears={totalYears}
            laneOffset={lane * LANE_HEIGHT}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Year ticks */}
      <div className="absolute inset-x-0 bottom-0 h-10 border-t border-heritage-border">
        {yearTicks.map((year) => {
          const left = ((year - startYear) / totalYears) * 100;
          return (
            <div
              key={year}
              className="absolute top-0 -translate-x-1/2"
              style={{ left: `${left}%` }}
            >
              <div className="mx-auto h-2 w-px bg-heritage-border" />
              <span className="text-[10px] tabular-nums text-heritage-muted">
                {year}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
