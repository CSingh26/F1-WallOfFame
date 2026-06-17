import { FIRST_F1_SEASON } from "@/lib/f1/constants";
import type { EraBand as EraBandType, HydratedF1Entity } from "@/lib/f1/types";
import { EraBand } from "./EraBand";
import { TimelineEntityMarker } from "./TimelineEntityMarker";

export function TimelineTrack({
  entities,
  eraBands,
  currentYear,
  selectedId,
  onSelect,
}: {
  entities: HydratedF1Entity[];
  eraBands: EraBandType[];
  currentYear: number;
  selectedId: string | null;
  onSelect: (entity: HydratedF1Entity) => void;
}) {
  const ticks: number[] = [];
  for (let year = FIRST_F1_SEASON; year <= currentYear; year += 5) {
    ticks.push(year);
  }
  if (ticks[ticks.length - 1] !== currentYear) {
    ticks.push(currentYear);
  }

  return (
    <div className="min-w-[88rem]">
      <div className="relative h-[36rem] overflow-hidden rounded-lg border border-heritage-border bg-black/45 shadow-museum">
        <div className="absolute inset-0 bg-racing bg-[length:58px_58px] opacity-20" />
        {eraBands.map((band) => (
          <EraBand key={band.id} band={band} currentYear={currentYear} />
        ))}
        <div className="absolute left-6 right-6 top-28 h-px bg-gradient-to-r from-transparent via-heritage-ivory/40 to-transparent" />
        {ticks.map((year) => {
          const left = ((year - FIRST_F1_SEASON) / (currentYear - FIRST_F1_SEASON)) * 100;
          return (
            <div key={year} className="absolute top-[6.25rem]" style={{ left: `${left}%` }}>
              <div className="h-8 w-px bg-white/25" />
              <div className="-translate-x-1/2 pt-2 text-[0.65rem] text-heritage-muted">{year}</div>
            </div>
          );
        })}
        {entities.map((entity, index) => (
          <TimelineEntityMarker
            key={`${entity.mode}:${entity.id}`}
            entity={entity}
            index={index}
            currentYear={currentYear}
            selected={selectedId === `${entity.mode}:${entity.id}`}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
