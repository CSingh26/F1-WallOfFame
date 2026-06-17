import { Building2, Flag, Timer } from "lucide-react";
import { ChampionshipStrip } from "./ChampionshipStrip";
import { EntityStatGrid } from "./EntityStatGrid";
import { EntityVisual } from "./EntityVisual";
import type { F1TeamEntity, HydratedF1Entity } from "@/lib/f1/types";
import { formatStat } from "@/lib/f1/utils";

export function TeamPlacard({ entity }: { entity: HydratedF1Entity<F1TeamEntity> }) {
  return (
    <div className="grid gap-5">
      <EntityVisual entity={entity} />
      <EntityStatGrid
        stats={[
          { label: "Constructors", value: entity.totalConstructorsChampionships, tone: "gold" },
          {
            label: "Drivers linked",
            value:
              typeof entity.totalDriversChampionshipsLinked === "number"
                ? entity.totalDriversChampionshipsLinked
                : "Sync pending",
          },
          { label: "Wins", value: formatStat(entity.wins) },
          { label: "Poles", value: formatStat(entity.poles) },
          { label: "Podiums", value: formatStat(entity.podiums) },
          {
            label: "Seasons",
            value: typeof entity.activeSeasons === "number" ? entity.activeSeasons : "Sync pending",
          },
        ]}
      />
      <ChampionshipStrip years={entity.championshipYears} />
      <div className="grid gap-3 rounded-md border border-heritage-border bg-black/25 p-4 text-sm leading-6 text-heritage-muted">
        <div className="flex items-center gap-2 text-heritage-ivory">
          <Flag className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          {entity.nationality} • Base: {entity.baseCountry}
        </div>
        <div className="flex items-center gap-2 text-heritage-ivory">
          <Timer className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          {entity.debutYear}-{entity.active ? "present" : entity.finalYear ?? "syncing"}
        </div>
        <div className="flex items-center gap-2 text-heritage-ivory">
          <Building2 className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
          {entity.active ? "Active constructor" : "Historic constructor"}
        </div>
        <p>{entity.longProfile}</p>
      </div>
    </div>
  );
}
