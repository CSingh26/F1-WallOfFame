"use client";

import { Flag, Gem, History, Trophy } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { SearchCommand } from "./SearchCommand";
import type { EraBand, F1EntityMode, HeritageStatsSummary, SearchResult } from "@/lib/f1/types";

export function HeritageHero({
  mode,
  stats,
  eraBands,
  onModeChange,
  onSearchSelect,
}: {
  mode: F1EntityMode;
  stats: HeritageStatsSummary;
  eraBands: EraBand[];
  onModeChange: (mode: F1EntityMode) => void;
  onSearchSelect: (result: SearchResult) => void;
}) {
  const statItems = [
    { label: "Seasons", value: stats.seasonsCovered, icon: History },
    { label: "Drivers", value: stats.driversIndexed, icon: Trophy },
    { label: "Teams", value: stats.teamsIndexed, icon: Flag },
    { label: "Eras", value: stats.championshipEras, icon: Gem },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-heritage-border bg-heritage-bg">
      <div className="absolute inset-0 -z-10 bg-carbon bg-[length:24px_24px] opacity-55" />
      <div className="absolute inset-0 -z-10 bg-racing bg-[length:72px_72px] opacity-20" />
      <div className="absolute left-0 top-0 -z-10 h-1 w-full bg-gradient-to-r from-transparent via-heritage-red to-heritage-gold" />
      <div className="mx-auto grid min-h-[84vh] max-w-7xl content-center gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-heritage-border bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-heritage-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-heritage-red" />
            1950 to {stats.currentYear}
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] text-heritage-ivory sm:text-7xl lg:text-8xl">
            F1 Heritage Explorer
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-heritage-muted sm:text-lg">
            A cinematic Formula 1 museum for drivers, constructors, championship eras, and
            safe stylized archive rooms.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[auto_minmax(20rem,35rem)] lg:items-end">
          <div className="flex flex-col gap-4">
            <ModeToggle mode={mode} onModeChange={onModeChange} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-heritage-border bg-black/35 p-4 backdrop-blur"
                  >
                    <Icon className="h-4 w-4 text-heritage-gold" aria-hidden="true" />
                    <div className="mt-3 text-2xl font-semibold">{item.value}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-heritage-muted">
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <SearchCommand mode={mode} onSelect={onSearchSelect} />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Championship era summary">
          {eraBands.map((band) => (
            <div
              key={band.id}
              className="min-w-[14rem] rounded-md border border-heritage-border bg-black/35 p-3"
            >
              <div className="text-xs font-semibold text-heritage-gold">
                {band.startYear}-{band.endYear}
              </div>
              <div className="mt-1 text-sm text-heritage-ivory">{band.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
