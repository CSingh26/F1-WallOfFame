import type { DriverEntity, TeamEntity } from "./types";
import { slugify } from "./utils";

/**
 * Normalizers convert raw Jolpica/OpenF1 records into partial entity patches.
 * They are intentionally defensive: external shapes vary, so every field is
 * read optionally and only well-formed values are surfaced. These patches are
 * later merged onto the deterministic seed entities by the sync layer.
 */

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asInt(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return undefined;
}

export interface DriverPatch {
  slug: string;
  givenName?: string;
  familyName?: string;
  nationality?: string;
  dateOfBirth?: string;
}

export function normalizeJolpicaDriver(raw: unknown): DriverPatch | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const given = asString(r.givenName);
  const family = asString(r.familyName);
  if (!given && !family) return null;
  const slug = slugify(`${given ?? ""} ${family ?? ""}`.trim());
  return {
    slug,
    givenName: given,
    familyName: family,
    nationality: asString(r.nationality),
    dateOfBirth: asString(r.dateOfBirth),
  };
}

export interface ConstructorPatch {
  slug: string;
  constructorName?: string;
  nationality?: string;
}

export function normalizeJolpicaConstructor(
  raw: unknown,
): ConstructorPatch | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const name = asString(r.name);
  if (!name) return null;
  return {
    slug: slugify(name),
    constructorName: name,
    nationality: asString(r.nationality),
  };
}

/** Aggregate standings rows into win/title counts (best-effort). */
export interface StandingTotals {
  slug: string;
  wins?: number;
  points?: number;
}

export function normalizeDriverStanding(raw: unknown): StandingTotals | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const driver = r.Driver as Record<string, unknown> | undefined;
  if (!driver) return null;
  const slug = slugify(
    `${asString(driver.givenName) ?? ""} ${asString(driver.familyName) ?? ""}`.trim(),
  );
  if (!slug) return null;
  return { slug, wins: asInt(r.wins), points: asInt(r.points) };
}

export function normalizeConstructorStanding(
  raw: unknown,
): StandingTotals | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const constructor = r.Constructor as Record<string, unknown> | undefined;
  if (!constructor) return null;
  const slug = slugify(asString(constructor.name) ?? "");
  if (!slug) return null;
  return { slug, wins: asInt(r.wins), points: asInt(r.points) };
}

/** Apply a driver patch to a seed driver without overwriting deterministic seed values. */
export function applyDriverPatch(
  driver: DriverEntity,
  patch: Partial<DriverEntity>,
): DriverEntity {
  return {
    ...driver,
    ...Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined && v !== null),
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function applyTeamPatch(
  team: TeamEntity,
  patch: Partial<TeamEntity>,
): TeamEntity {
  return {
    ...team,
    ...Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined && v !== null),
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Normalize an OpenF1 modern driver record into enrichment metadata. */
export interface OpenF1DriverEnrichment {
  fullName?: string;
  countryCode?: string;
  teamName?: string;
  teamColor?: string;
}

export function normalizeOpenF1Driver(
  raw: unknown,
): OpenF1DriverEnrichment | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const teamColorRaw = asString(r.team_colour);
  return {
    fullName: asString(r.full_name),
    countryCode: asString(r.country_code),
    teamName: asString(r.team_name),
    teamColor: teamColorRaw ? `#${teamColorRaw.replace(/^#/, "")}` : undefined,
  };
}
