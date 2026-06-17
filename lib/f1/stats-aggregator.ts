import { CURRENT_F1_YEAR, FIRST_F1_SEASON } from "./constants";
import { eraBands } from "./era-bands";
import { seedDrivers } from "./seed-drivers";
import { seedTeams } from "./seed-teams";
import type { HeritageStatsSummary } from "./types";

export function getStatsSummary(): HeritageStatsSummary {
  return {
    seasonsCovered: CURRENT_F1_YEAR - FIRST_F1_SEASON + 1,
    driversIndexed: seedDrivers.length,
    teamsIndexed: seedTeams.length,
    championshipEras: eraBands.length,
    currentYear: CURRENT_F1_YEAR,
  };
}
