import { CURRENT_F1_YEAR } from "./constants";
import type { EraBand } from "./types";

export const eraBands: EraBand[] = [
  {
    id: "birth-of-championship",
    label: "Fangio and the birth of the championship",
    startYear: 1950,
    endYear: 1958,
    description:
      "The world championship forms around dangerous circuits, front-engined machines, and early legends.",
    colorHint: "#8f7a4a",
  },
  {
    id: "british-garagistes",
    label: "British garagistes and Lotus innovation",
    startYear: 1959,
    endYear: 1967,
    description:
      "Rear engines, lightweight design, and British constructors reshape Formula 1.",
    colorHint: "#315f55",
  },
  {
    id: "wings-risk-ferrari",
    label: "Wings, risk, and Ferrari resurgence",
    startYear: 1968,
    endYear: 1976,
    description:
      "Aero experimentation, sponsorship liveries, danger, and iconic rivalries define the sport.",
    colorHint: "#8e2727",
  },
  {
    id: "ground-effects-turbo",
    label: "Ground effects and turbo wars",
    startYear: 1977,
    endYear: 1988,
    description:
      "Technology escalates through ground effects, turbo power, and increasingly specialized teams.",
    colorHint: "#476b8f",
  },
  {
    id: "senna-prost",
    label: "Senna, Prost, and McLaren dominance",
    startYear: 1988,
    endYear: 1993,
    description:
      "Precision, rivalry, and political tension create one of F1's most dramatic eras.",
    colorHint: "#c56b3f",
  },
  {
    id: "schumacher-era",
    label: "Schumacher era",
    startYear: 1994,
    endYear: 2004,
    description:
      "Safety reforms, Ferrari's revival, and Schumacher's dominance define modern professionalism.",
    colorHint: "#b91c1c",
  },
  {
    id: "renault-brawn-red-bull",
    label: "Renault, Ferrari, Brawn, and Red Bull rise",
    startYear: 2005,
    endYear: 2013,
    description:
      "Changing rules create shifting dynasties before Red Bull masters the blown-diffuser era.",
    colorHint: "#5f72ad",
  },
  {
    id: "hybrid-mercedes",
    label: "Hybrid Mercedes era",
    startYear: 2014,
    endYear: 2021,
    description:
      "Turbo-hybrid power units, Mercedes dominance, and Hamilton's records reshape the modern sport.",
    colorHint: "#14b8a6",
  },
  {
    id: "modern-ground-effect",
    label: "Ground-effect modern era",
    startYear: 2022,
    endYear: CURRENT_F1_YEAR,
    description:
      "New aerodynamics, cost caps, and Red Bull's modern dominance define the latest chapter.",
    colorHint: "#d6a241",
  },
];
