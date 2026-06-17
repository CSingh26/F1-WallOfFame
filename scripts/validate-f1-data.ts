/**
 * Validates the deterministic F1 seed dataset for integrity.
 *
 * Checks performed:
 *  - required string/number fields are present and non-empty
 *  - no duplicate entity ids or slugs (within each mode)
 *  - championship years fall within [1950, current season]
 *  - championship counts match the championshipYears array length
 *  - colors are valid hex values
 *  - image license status is never "approved" unless backed by the manifest
 *  - artifacts reference their owning entity and have valid display positions
 *
 * Exits non-zero when any problem is found. Usage: npm run validate:data
 */
import { SEED_DRIVERS } from "../lib/f1/seed-drivers";
import { SEED_TEAMS } from "../lib/f1/seed-teams";
import { HERITAGE_START_YEAR } from "../lib/f1/constants";
import { getCurrentSeasonYear } from "../lib/f1/utils";
import { findApprovedEntry } from "../lib/f1/approved-image-manifest";
import type { HeritageEntity } from "../lib/f1/types";

const HEX = /^#([0-9a-fA-F]{6})$/;
const problems: string[] = [];
const currentYear = getCurrentSeasonYear();

function fail(msg: string) {
  problems.push(msg);
}

function checkColors(label: string, colors: Array<[string, string]>) {
  for (const [name, value] of colors) {
    if (!HEX.test(value)) fail(`${label}: invalid hex for ${name}: "${value}"`);
  }
}

function checkChampionshipYears(label: string, years: number[], total: number) {
  if (years.length !== total) {
    fail(
      `${label}: totalChampionships (${total}) != championshipYears.length (${years.length})`,
    );
  }
  for (const y of years) {
    if (y < HERITAGE_START_YEAR || y > currentYear) {
      fail(`${label}: championship year ${y} outside [${HERITAGE_START_YEAR}, ${currentYear}]`);
    }
  }
  const dupes = years.filter((y, i) => years.indexOf(y) !== i);
  if (dupes.length) fail(`${label}: duplicate championship years ${dupes.join(", ")}`);
}

function checkImage(label: string, entity: HeritageEntity) {
  const img = entity.image;
  if (img.licenseStatus === "approved") {
    const entry = findApprovedEntry(entity.mode, entity.id, img.kind);
    if (!entry) {
      fail(
        `${label}: image marked "approved" but no matching approved manifest entry exists`,
      );
    }
  }
  if (!img.alt || img.alt.trim().length === 0) {
    fail(`${label}: image is missing alt text`);
  }
}

function checkArtifacts(label: string, entity: HeritageEntity) {
  const ids = new Set<string>();
  for (const a of entity.artifacts) {
    if (ids.has(a.id)) fail(`${label}: duplicate artifact id ${a.id}`);
    ids.add(a.id);
    if (a.entityId !== entity.id) {
      fail(`${label}: artifact ${a.id} entityId mismatch (${a.entityId})`);
    }
    if (a.year !== null && (a.year < HERITAGE_START_YEAR || a.year > currentYear)) {
      fail(`${label}: artifact ${a.id} year ${a.year} out of range`);
    }
    const { x, y, z } = a.displayPosition;
    if ([x, y, z].some((n) => !Number.isFinite(n))) {
      fail(`${label}: artifact ${a.id} has a non-finite display position`);
    }
    if (!HEX.test(a.color)) {
      fail(`${label}: artifact ${a.id} has invalid color "${a.color}"`);
    }
  }
}

function uniqueness(label: string, entities: HeritageEntity[]) {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const e of entities) {
    if (ids.has(e.id)) fail(`${label}: duplicate id ${e.id}`);
    ids.add(e.id);
    if (ids.size && slugs.has(e.slug)) fail(`${label}: duplicate slug ${e.slug}`);
    slugs.add(e.slug);
  }
}

function main() {
  // Drivers
  uniqueness("drivers", SEED_DRIVERS);
  for (const d of SEED_DRIVERS) {
    const label = `driver ${d.id}`;
    if (!d.name?.trim()) fail(`${label}: missing name`);
    if (!d.slug?.trim()) fail(`${label}: missing slug`);
    if (!d.nationality?.trim()) fail(`${label}: missing nationality`);
    if (!Number.isInteger(d.debutYear)) fail(`${label}: invalid debutYear`);
    if (d.debutYear < HERITAGE_START_YEAR || d.debutYear > currentYear) {
      fail(`${label}: debutYear ${d.debutYear} out of range`);
    }
    if (!d.bio30Words?.trim()) fail(`${label}: missing bio`);
    checkColors(label, [
      ["primaryColor", d.primaryColor],
      ["secondaryColor", d.secondaryColor],
      ["helmetColor", d.helmetColor],
    ]);
    checkChampionshipYears(label, d.championshipYears, d.totalChampionships);
    checkImage(label, d);
    checkArtifacts(label, d);
  }

  // Teams
  uniqueness("teams", SEED_TEAMS);
  for (const t of SEED_TEAMS) {
    const label = `team ${t.id}`;
    if (!t.constructorName?.trim()) fail(`${label}: missing constructorName`);
    if (!t.slug?.trim()) fail(`${label}: missing slug`);
    if (!t.nationality?.trim()) fail(`${label}: missing nationality`);
    if (!Number.isInteger(t.debutYear)) fail(`${label}: invalid debutYear`);
    if (t.debutYear < HERITAGE_START_YEAR || t.debutYear > currentYear) {
      fail(`${label}: debutYear ${t.debutYear} out of range`);
    }
    if (!t.profile30Words?.trim()) fail(`${label}: missing profile`);
    checkColors(label, [
      ["primaryColor", t.primaryColor],
      ["secondaryColor", t.secondaryColor],
      ["liveryStripeColor", t.liveryStripeColor],
    ]);
    checkChampionshipYears(
      label,
      t.championshipYears,
      t.totalConstructorsChampionships,
    );
    checkImage(label, t);
    checkArtifacts(label, t);
  }

  if (problems.length === 0) {
    console.log("✓ F1 seed data validation passed");
    console.log(`  ${SEED_DRIVERS.length} drivers, ${SEED_TEAMS.length} teams`);
    console.log(`  Coverage window: ${HERITAGE_START_YEAR}–${currentYear}`);
    return;
  }

  console.error(`✗ F1 seed data validation found ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exitCode = 1;
}

main();
