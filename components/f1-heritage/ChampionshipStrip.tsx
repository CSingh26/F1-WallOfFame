import { Trophy } from "lucide-react";

export function ChampionshipStrip({ years }: { years: number[] }) {
  return (
    <div className="rounded-md border border-heritage-border bg-black/35 p-3">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-heritage-gold">
        <Trophy className="h-4 w-4" aria-hidden="true" />
        Championship years
      </div>
      {years.length ? (
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <span
              key={year}
              className="rounded-full border border-heritage-gold/70 bg-heritage-gold/15 px-3 py-1 text-sm font-semibold text-heritage-gold"
            >
              {year}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-heritage-muted">No world championship crown in the seed archive.</p>
      )}
    </div>
  );
}
