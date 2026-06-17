import { ERA_BANDS } from "./constants";
import { SEED_DRIVERS } from "./seed-drivers";
import { SEED_TEAMS } from "./seed-teams";
import type { HeritageEntity, StatsSummary } from "./types";
import { getCurrentSeasonYear } from "./utils";

/**
 * Deterministic stat aggregation derived from the canonical seed data.
 * These numbers are exact and do NOT depend on vector search.
 */

export function getStatsSummary(): StatsSummary {
  const currentYear = getCurrentSeasonYear();
  const startYear = ERA_BANDS[0].startYear;
  const artifacts =
    SEED_DRIVERS.reduce((sum, d) => sum + d.artifacts.length, 0) +
    SEED_TEAMS.reduce((sum, t) => sum + t.artifacts.length, 0);

  return {
    seasonsCovered: currentYear - startYear + 1,
    startYear,
    currentYear,
    driversIndexed: SEED_DRIVERS.length,
    teamsIndexed: SEED_TEAMS.length,
    championshipEras: ERA_BANDS.length,
    artifactsIndexed: artifacts,
  };
}

export interface ComparisonRow {
  label: string;
  a: string | number;
  b: string | number;
}

/** Build a comparison table between two entities for the compare dock. */
export function buildComparison(
  a: HeritageEntity,
  b: HeritageEntity,
): ComparisonRow[] {
  const titleA =
    a.mode === "driver" ? a.totalChampionships : a.totalConstructorsChampionships;
  const titleB =
    b.mode === "driver" ? b.totalChampionships : b.totalConstructorsChampionships;

  const fmt = (v: number | null) => (v === null ? "Data syncing" : v);

  return [
    { label: "Championships", a: titleA, b: titleB },
    { label: "Wins", a: fmt(a.wins), b: fmt(b.wins) },
    { label: "Poles", a: fmt(a.poles), b: fmt(b.poles) },
    { label: "Podiums", a: fmt(a.podiums), b: fmt(b.podiums) },
    {
      label: "Active years",
      a: a.mode === "driver" ? a.careerSpanLabel : spanLabelTeam(a),
      b: b.mode === "driver" ? b.careerSpanLabel : spanLabelTeam(b),
    },
    {
      label: "Primary era",
      a: a.mode === "driver" ? a.primaryEra : eraLabelForTeam(a.debutYear),
      b: b.mode === "driver" ? b.primaryEra : eraLabelForTeam(b.debutYear),
    },
  ];
}

function spanLabelTeam(team: Extract<HeritageEntity, { mode: "team" }>): string {
  return team.finalYear === null
    ? `${team.debutYear}–present`
    : `${team.debutYear}–${team.finalYear}`;
}

function eraLabelForTeam(year: number): string {
  for (const band of ERA_BANDS) {
    if (year >= band.startYear && year <= band.endYear) return band.id;
  }
  return ERA_BANDS[ERA_BANDS.length - 1].id;
}
