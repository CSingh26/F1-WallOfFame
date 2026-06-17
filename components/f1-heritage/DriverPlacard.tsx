"use client";

import type { DriverEntity } from "@/lib/f1/types";
import { EntityVisual } from "./EntityVisual";
import { EntityStatGrid } from "./EntityStatGrid";
import { ChampionshipStrip } from "./ChampionshipStrip";

export function DriverPlacard({ driver }: { driver: DriverEntity }) {
  return (
    <div className="space-y-5">
      <div className="flex gap-4">
        <div className="h-28 w-24 shrink-0">
          <EntityVisual
            image={driver.image}
            primaryColor={driver.primaryColor}
            secondaryColor={driver.secondaryColor}
            kind="portrait"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-heritage-muted">
            {driver.nationality} · {driver.careerSpanLabel}
          </p>
          <h2 className="mt-1 font-display text-2xl leading-tight text-heritage-ivory">
            {driver.name}
          </h2>
          <p className="mt-1 text-sm text-heritage-muted">
            {driver.active ? "Active driver" : "Historic driver"} · Primary team{" "}
            {driver.primaryTeam}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {driver.teams.slice(0, 4).map((team) => (
              <span
                key={team}
                className="rounded-full border border-heritage-border px-2 py-0.5 text-[11px] text-heritage-muted"
              >
                {team}
              </span>
            ))}
          </div>
        </div>
      </div>

      <EntityStatGrid
        stats={[
          { label: "Titles", value: driver.totalChampionships },
          { label: "Wins", value: driver.wins },
          { label: "Poles", value: driver.poles },
          { label: "Podiums", value: driver.podiums },
          { label: "Fastest laps", value: driver.fastestLaps },
          { label: "Entries", value: driver.entries },
        ]}
      />

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-widest text-heritage-muted">
          Championship years
        </h3>
        <ChampionshipStrip years={driver.championshipYears} />
      </section>

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-widest text-heritage-muted">
          Profile
        </h3>
        <p className="text-sm leading-relaxed text-heritage-ivory/90">
          {driver.longBio}
        </p>
      </section>

      <SourceBadges sources={driver.sourceRefs.map((s) => s.source)} />
    </div>
  );
}

function SourceBadges({ sources }: { sources: string[] }) {
  const unique = Array.from(new Set(sources));
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-heritage-border pt-3">
      <span className="text-[10px] uppercase tracking-widest text-heritage-muted">
        Sources
      </span>
      {unique.map((s) => (
        <span
          key={s}
          className="rounded border border-heritage-border px-1.5 py-0.5 text-[10px] uppercase text-heritage-muted"
        >
          {s}
        </span>
      ))}
    </div>
  );
}
