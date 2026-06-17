"use client";

import { Trophy } from "lucide-react";

export function ChampionshipStrip({ years }: { years: number[] }) {
  if (years.length === 0) {
    return (
      <p className="text-sm text-heritage-muted">
        No championship years on record yet.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {[...years]
        .sort((a, b) => a - b)
        .map((year) => (
          <span
            key={year}
            className="inline-flex items-center gap-1.5 rounded-full border border-heritage-gold/40 bg-heritage-gold/10 px-3 py-1 text-sm text-heritage-gold"
          >
            <Trophy className="h-3.5 w-3.5" aria-hidden />
            <span className="tabular-nums">{year}</span>
          </span>
        ))}
    </div>
  );
}
