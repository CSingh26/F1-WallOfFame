import { Flag, Timer, UsersRound } from "lucide-react";
import { ChampionshipStrip } from "./ChampionshipStrip";
import { EntityStatGrid } from "./EntityStatGrid";
import { EntityVisual } from "./EntityVisual";
import type { F1DriverEntity, HydratedF1Entity } from "@/lib/f1/types";
import { formatStat } from "@/lib/f1/utils";

export function DriverPlacard({ entity }: { entity: HydratedF1Entity<F1DriverEntity> }) {
  return (
    <div className="grid gap-5">
      <EntityVisual entity={entity} />
      <EntityStatGrid
        stats={[
          { label: "Titles", value: entity.totalChampionships, tone: "gold" },
          { label: "Wins", value: formatStat(entity.wins) },
          { label: "Poles", value: formatStat(entity.poles) },
          { label: "Podiums", value: formatStat(entity.podiums) },
          { label: "Entries", value: formatStat(entity.entries) },
          { label: "Fastest laps", value: formatStat(entity.fastestLaps) },
        ]}
      />
      <ChampionshipStrip years={entity.championshipYears} />
      <div className="grid gap-3 rounded-md border border-heritage-border bg-black/25 p-4 text-sm leading-6 text-heritage-muted">
        <div className="flex items-center gap-2 text-heritage-ivory">
          <Flag className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          {entity.nationality} • {entity.countryCode}
        </div>
        <div className="flex items-center gap-2 text-heritage-ivory">
          <Timer className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          {entity.careerSpanLabel} • {entity.primaryEra}
        </div>
        <div className="flex items-center gap-2 text-heritage-ivory">
          <UsersRound className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          {entity.teams.join(", ")}
        </div>
        <p>{entity.longBio}</p>
      </div>
    </div>
  );
}
