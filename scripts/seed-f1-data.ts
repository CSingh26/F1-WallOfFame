/**
 * Prints a summary of the deterministic seed dataset.
 *
 * The F1 Heritage Explorer ships with a fully deterministic in-memory seed
 * (drivers, teams, artifacts, era bands), so there is no database to write to.
 * This script exists to (a) verify the seed loads cleanly and (b) report what
 * is bundled. Optional live enrichment happens via the /api/f1/sync routes.
 *
 * Usage: npm run seed:data
 */
import { SEED_DRIVERS } from "../lib/f1/seed-drivers";
import { SEED_TEAMS } from "../lib/f1/seed-teams";
import { getStats } from "../lib/f1/repository";

function main() {
  const stats = getStats();
  const driverArtifacts = SEED_DRIVERS.reduce(
    (n, d) => n + d.artifacts.length,
    0,
  );
  const teamArtifacts = SEED_TEAMS.reduce((n, t) => n + t.artifacts.length, 0);

  console.log("F1 Heritage Explorer — seed dataset");
  console.log("===================================");
  console.log(`Drivers:            ${SEED_DRIVERS.length}`);
  console.log(`Teams:              ${SEED_TEAMS.length}`);
  console.log(`Driver artifacts:   ${driverArtifacts}`);
  console.log(`Team artifacts:     ${teamArtifacts}`);
  console.log(`Total artifacts:    ${stats.artifactsIndexed}`);
  console.log(`Seasons covered:    ${stats.seasonsCovered}`);
  console.log(`Championship eras:  ${stats.championshipEras}`);
  console.log(
    `Coverage:           ${stats.startYear}–${stats.currentYear}`,
  );
  console.log("\nSeed is deterministic and requires no external services.");
}

main();
