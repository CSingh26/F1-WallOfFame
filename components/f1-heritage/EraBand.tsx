"use client";

import type { EraBand as EraBandType } from "@/lib/f1/types";

interface EraBandProps {
  band: EraBandType;
  startYear: number;
  endYear: number;
  totalYears: number;
}

/** A translucent era backdrop spanning its year range behind the track. */
export function EraBand({ band, startYear, endYear, totalYears }: EraBandProps) {
  const bandStart = Math.max(band.startYear, startYear);
  const bandEnd = Math.min(band.endYear, endYear);
  const left = ((bandStart - startYear) / totalYears) * 100;
  const width = ((bandEnd - bandStart + 1) / totalYears) * 100;

  return (
    <div
      className="absolute top-0 flex h-full flex-col justify-between border-l border-heritage-border/60 px-3 py-2"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        background: `linear-gradient(180deg, ${band.colorHint}14, transparent 60%)`,
      }}
      aria-hidden
    >
      <span className="line-clamp-2 max-w-[160px] text-[10px] font-medium uppercase leading-tight tracking-wide text-heritage-muted">
        {band.label}
      </span>
      <span className="text-[10px] tabular-nums text-heritage-muted/60">
        {band.startYear}
        {band.endYear > 9000 ? "–now" : `–${band.endYear}`}
      </span>
    </div>
  );
}
