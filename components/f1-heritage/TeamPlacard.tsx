"use client";

import type { TeamEntity } from "@/lib/f1/types";
import { EntityVisual } from "./EntityVisual";
import { EntityStatGrid } from "./EntityStatGrid";
import { ChampionshipStrip } from "./ChampionshipStrip";

export function TeamPlacard({ team }: { team: TeamEntity }) {
  const span =
    team.finalYear === null
      ? `${team.debutYear}–present`
      : `${team.debutYear}–${team.finalYear}`;

  return (
    <div className="space-y-5">
      <div className="flex gap-4">
        <div className="h-28 w-24 shrink-0">
          <EntityVisual
            image={team.image}
            primaryColor={team.primaryColor}
            secondaryColor={team.secondaryColor}
            kind="team-card"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-heritage-muted">
            {team.nationality} · {span}
          </p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-heritage-ivory">
            {team.constructorName}
          </h2>
          <p className="mt-1 text-sm text-heritage-muted">
            {team.active ? "Active constructor" : "Historic constructor"} ·{" "}
            Based in {team.baseCountry}
          </p>
        </div>
      </div>

      <EntityStatGrid
        stats={[
          { label: "Constructors", value: team.totalConstructorsChampionships },
          { label: "Drivers' titles", value: team.totalDriversChampionshipsLinked },
          { label: "Wins", value: team.wins },
          { label: "Poles", value: team.poles },
          { label: "Podiums", value: team.podiums },
          { label: "Seasons", value: team.activeSeasons },
        ]}
      />

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-widest text-heritage-muted">
          Constructors&apos; championship years
        </h3>
        <ChampionshipStrip years={team.championshipYears} />
      </section>

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-widest text-heritage-muted">
          Profile
        </h3>
        <p className="text-sm leading-relaxed text-heritage-ivory/90">
          {team.longProfile}
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-2 border-t border-heritage-border pt-3">
        <span className="text-[10px] uppercase tracking-widest text-heritage-muted">
          Sources
        </span>
        {Array.from(new Set(team.sourceRefs.map((s) => s.source))).map((s) => (
          <span
            key={s}
            className="rounded border border-heritage-border px-1.5 py-0.5 text-[10px] uppercase text-heritage-muted"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
