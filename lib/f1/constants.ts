import type { EraBand, EraId } from "./types";

/** Canonical app constants shared across UI and data layers. */

export const HERITAGE_START_YEAR = 1950;

export const MODE_LABELS = {
  driver: "Driver View",
  team: "Team View",
} as const;

export const ROOM_LABELS = {
  driver: "Enter Trophy Room",
  team: "Enter Factory Floor",
} as const;

export const ROOM_TITLES = {
  driver: "Driver Locker Room",
  team: "Team Factory Floor",
} as const;

export const IMPORTANCE_WEIGHT = {
  legendary: 3,
  major: 2,
  standard: 1,
} as const;

/** Era band metadata, ordered chronologically. */
export const ERA_BANDS: EraBand[] = [
  {
    id: "1950-1958",
    label: "Fangio and the birth of the championship",
    startYear: 1950,
    endYear: 1958,
    description:
      "The world championship forms around dangerous circuits, front-engined machines, and early legends.",
    colorHint: "#7a5c2e",
  },
  {
    id: "1959-1967",
    label: "British garagistes and Lotus innovation",
    startYear: 1959,
    endYear: 1967,
    description:
      "Rear engines, lightweight design, and British constructors reshape Formula 1.",
    colorHint: "#2e5a7a",
  },
  {
    id: "1968-1976",
    label: "Wings, risk, and Ferrari resurgence",
    startYear: 1968,
    endYear: 1976,
    description:
      "Aero experimentation, sponsorship liveries, danger, and iconic rivalries define the sport.",
    colorHint: "#7a2e2e",
  },
  {
    id: "1977-1988",
    label: "Ground effects and turbo wars",
    startYear: 1977,
    endYear: 1988,
    description:
      "Technology escalates through ground effects, turbo power, and increasingly specialized teams.",
    colorHint: "#5a2e7a",
  },
  {
    id: "1988-1993",
    label: "Senna, Prost, and McLaren dominance",
    startYear: 1988,
    endYear: 1993,
    description:
      "Precision, rivalry, and political tension create one of F1's most dramatic eras.",
    colorHint: "#7a6b2e",
  },
  {
    id: "1994-2004",
    label: "Schumacher era",
    startYear: 1994,
    endYear: 2004,
    description:
      "Safety reforms, Ferrari's revival, and Schumacher's dominance define modern professionalism.",
    colorHint: "#7a2e3e",
  },
  {
    id: "2005-2013",
    label: "Renault, Ferrari, Brawn, and Red Bull rise",
    startYear: 2005,
    endYear: 2013,
    description:
      "Changing rules create shifting dynasties before Red Bull masters the blown-diffuser era.",
    colorHint: "#2e7a5a",
  },
  {
    id: "2014-2021",
    label: "Hybrid Mercedes era",
    startYear: 2014,
    endYear: 2021,
    description:
      "Turbo-hybrid power units, Mercedes dominance, and Hamilton's records reshape the modern sport.",
    colorHint: "#2e7a7a",
  },
  {
    id: "2022-present",
    label: "Ground-effect modern era",
    startYear: 2022,
    endYear: 9999,
    description:
      "New aerodynamics, cost caps, and Red Bull's modern dominance define the latest chapter.",
    colorHint: "#3e2e7a",
  },
];

export function eraForYear(year: number): EraId {
  for (const band of ERA_BANDS) {
    if (year >= band.startYear && year <= band.endYear) return band.id;
  }
  return ERA_BANDS[ERA_BANDS.length - 1].id;
}
