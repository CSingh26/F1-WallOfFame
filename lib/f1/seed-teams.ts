import { HERITAGE_SOURCE_REFS } from "./constants";
import { resolveImageAsset } from "./image-provider";
import type { F1TeamEntity } from "./types";

const updatedAt = "2026-06-17T00:00:00.000Z";

type TeamSeed = Omit<
  F1TeamEntity,
  | "mode"
  | "slug"
  | "wins"
  | "poles"
  | "podiums"
  | "image"
  | "artifactIds"
  | "sourceRefs"
  | "updatedAt"
>;

function artifactsForTeam(id: string, hasTitle: boolean) {
  return [
    `team-${id}-car`,
    `team-${id}-factory`,
    hasTitle ? `team-${id}-cabinet` : `team-${id}-season-card`,
    `team-${id}-moment`,
  ];
}

function team(seed: TeamSeed): F1TeamEntity {
  return {
    ...seed,
    mode: "team",
    slug: seed.id,
    wins: null,
    poles: null,
    podiums: null,
    image: resolveImageAsset(seed.id, "team", seed.constructorName, "team-card"),
    artifactIds: artifactsForTeam(seed.id, seed.championshipYears.length > 0),
    sourceRefs: [HERITAGE_SOURCE_REFS.seed, HERITAGE_SOURCE_REFS.jolpica],
    updatedAt,
  };
}

export const seedTeams: F1TeamEntity[] = [
  team({
    id: "ferrari",
    constructorName: "Ferrari",
    nationality: "Italian",
    baseCountry: "Italy",
    debutYear: 1950,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [
      1961, 1964, 1975, 1976, 1977, 1979, 1982, 1983, 1999, 2000, 2001, 2002,
      2003, 2004, 2007, 2008,
    ],
    totalConstructorsChampionships: 16,
    totalDriversChampionshipsLinked: 15,
    primaryColor: "#b91c1c",
    secondaryColor: "#f4d35e",
    liveryStripeColor: "#facc15",
    profile30Words:
      "Ferrari is Formula 1's longest-running myth: factory, theatre, pressure chamber, and archive of red championship memory.",
    longProfile:
      "Scuderia Ferrari carries unique weight because it has been present since the championship's birth. Its story mixes national identity, engineering pride, tragedy, politics, and eras of dominance.",
  }),
  team({
    id: "mclaren",
    constructorName: "McLaren",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1966,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [1974, 1984, 1985, 1988, 1989, 1990, 1991, 1998, 2024, 2025],
    totalConstructorsChampionships: 10,
    totalDriversChampionshipsLinked: 12,
    primaryColor: "#f97316",
    secondaryColor: "#111111",
    liveryStripeColor: "#38bdf8",
    profile30Words:
      "McLaren moves from papaya innovation to carbon-fiber revolution, Senna-Prost intensity, and a renewed modern title charge.",
    longProfile:
      "McLaren's heritage is both technical and emotional: Bruce McLaren's founding spirit, Ron Dennis precision, legendary rivalries, and a modern revival built on operational clarity.",
  }),
  team({
    id: "williams",
    constructorName: "Williams",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1977,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [1980, 1981, 1986, 1987, 1992, 1993, 1994, 1996, 1997],
    totalConstructorsChampionships: 9,
    totalDriversChampionshipsLinked: 7,
    primaryColor: "#1d4ed8",
    secondaryColor: "#f4ead8",
    liveryStripeColor: "#60a5fa",
    profile30Words:
      "Williams represents independent engineering at grand scale: efficient, stubborn, and responsible for some of F1's cleanest dominant cars.",
    longProfile:
      "Williams grew from Frank Williams and Patrick Head's competitive austerity into a championship institution. Its best cars were ruthless expressions of aerodynamics, suspension, and organization.",
  }),
  team({
    id: "mercedes",
    constructorName: "Mercedes",
    nationality: "German",
    baseCountry: "United Kingdom",
    debutYear: 1954,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
    totalConstructorsChampionships: 8,
    totalDriversChampionshipsLinked: 9,
    primaryColor: "#14b8a6",
    secondaryColor: "#111111",
    liveryStripeColor: "#c0c7d1",
    profile30Words:
      "Mercedes turned the hybrid era into an engineering dynasty, combining power-unit mastery with operational calm.",
    longProfile:
      "Mercedes has two great F1 lives: the 1950s silver-arrow burst and the hybrid-era machine that reset modern standards for reliability, power, strategy, and sustained title pressure.",
  }),
  team({
    id: "red-bull-racing",
    constructorName: "Red Bull Racing",
    nationality: "Austrian",
    baseCountry: "United Kingdom",
    debutYear: 2005,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [2010, 2011, 2012, 2013, 2022, 2023],
    totalConstructorsChampionships: 6,
    totalDriversChampionshipsLinked: 8,
    primaryColor: "#1d2d6b",
    secondaryColor: "#ef4444",
    liveryStripeColor: "#facc15",
    profile30Words:
      "Red Bull made energy-drink audacity serious, building aero-led dynasties around Vettel and Verstappen.",
    longProfile:
      "Red Bull Racing changed the tone of Formula 1 while mastering its technical demands. Its title eras are shaped by design confidence, aggressive culture, and elite driver focus.",
  }),
  team({
    id: "lotus",
    constructorName: "Lotus",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1958,
    finalYear: 1994,
    active: false,
    activeSeasons: null,
    championshipYears: [1963, 1965, 1968, 1970, 1972, 1973, 1978],
    totalConstructorsChampionships: 7,
    totalDriversChampionshipsLinked: 6,
    primaryColor: "#1f6f43",
    secondaryColor: "#f6d04d",
    liveryStripeColor: "#f6d04d",
    profile30Words:
      "Lotus compressed genius and danger into lightweight cars that repeatedly changed what Formula 1 thought was possible.",
    longProfile:
      "Team Lotus was Colin Chapman's laboratory. Rear engines, monocoques, wings, and ground effects all passed through its story, often with brilliance and risk inseparable.",
  }),
  team({
    id: "renault",
    constructorName: "Renault",
    nationality: "French",
    baseCountry: "United Kingdom",
    debutYear: 1977,
    finalYear: 2020,
    active: false,
    activeSeasons: null,
    championshipYears: [2005, 2006],
    totalConstructorsChampionships: 2,
    totalDriversChampionshipsLinked: 2,
    primaryColor: "#facc15",
    secondaryColor: "#1d4ed8",
    liveryStripeColor: "#2563eb",
    profile30Words:
      "Renault brought turbo disruption and later ended Ferrari's Schumacher run with compact, clever championship cars.",
    longProfile:
      "Renault's F1 identity is technical disruption. From early turbocharging to the Alonso title years, the constructor repeatedly arrived as a rule-shaping force.",
  }),
  team({
    id: "brabham",
    constructorName: "Brabham",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1962,
    finalYear: 1992,
    active: false,
    activeSeasons: null,
    championshipYears: [1966, 1967],
    totalConstructorsChampionships: 2,
    totalDriversChampionshipsLinked: 4,
    primaryColor: "#1f8f5f",
    secondaryColor: "#f4ead8",
    liveryStripeColor: "#22c55e",
    profile30Words:
      "Brabham joins driver-founder grit, Repco ingenuity, and Bernie Ecclestone-era experimentation into a restless F1 identity.",
    longProfile:
      "Brabham's story moves from Jack Brabham winning in his own car to Gordon Murray's creative technical swings. It remains one of F1's great constructor names.",
  }),
  team({
    id: "benetton",
    constructorName: "Benetton",
    nationality: "Italian",
    baseCountry: "United Kingdom",
    debutYear: 1986,
    finalYear: 2001,
    active: false,
    activeSeasons: null,
    championshipYears: [1995],
    totalConstructorsChampionships: 1,
    totalDriversChampionshipsLinked: 2,
    primaryColor: "#0f8a3a",
    secondaryColor: "#2563eb",
    liveryStripeColor: "#ef4444",
    profile30Words:
      "Benetton brought color, commercial edge, and Schumacher's first title machine into the professionalizing 1990s.",
    longProfile:
      "Benetton was vibrant but serious, developing from fashion-backed outsider into a race-winning operation. Its Schumacher years became a bridge toward Ferrari's later dynasty.",
  }),
  team({
    id: "tyrrell",
    constructorName: "Tyrrell",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1970,
    finalYear: 1998,
    active: false,
    activeSeasons: null,
    championshipYears: [1971],
    totalConstructorsChampionships: 1,
    totalDriversChampionshipsLinked: 2,
    primaryColor: "#244c9a",
    secondaryColor: "#f4ead8",
    liveryStripeColor: "#60a5fa",
    profile30Words:
      "Tyrrell was compact, clever, and occasionally radical, forever tied to Stewart's champion clarity and the six-wheeled P34.",
    longProfile:
      "Ken Tyrrell's team showed how a smaller constructor could still define eras. Stewart's titles gave it gravitas; later experiments gave it lasting technical folklore.",
  }),
  team({
    id: "cooper",
    constructorName: "Cooper",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1950,
    finalYear: 1969,
    active: false,
    activeSeasons: null,
    championshipYears: [1959, 1960],
    totalConstructorsChampionships: 2,
    totalDriversChampionshipsLinked: 2,
    primaryColor: "#0f5132",
    secondaryColor: "#f4ead8",
    liveryStripeColor: "#22c55e",
    profile30Words:
      "Cooper's rear-engine revolution overturned front-engine convention and opened the path for modern Formula 1 design.",
    longProfile:
      "Cooper's importance is structural. By proving rear-engine layouts at championship level, it helped move Formula 1 away from its original mechanical grammar.",
  }),
  team({
    id: "alfa-romeo",
    constructorName: "Alfa Romeo",
    nationality: "Italian",
    baseCountry: "Italy",
    debutYear: 1950,
    finalYear: 2023,
    active: false,
    activeSeasons: null,
    championshipYears: [],
    totalConstructorsChampionships: 0,
    totalDriversChampionshipsLinked: 2,
    primaryColor: "#8b1e1e",
    secondaryColor: "#f4ead8",
    liveryStripeColor: "#64748b",
    profile30Words:
      "Alfa Romeo bookends F1 history: dominant at the championship's birth and later revived as a modern heritage name.",
    longProfile:
      "Alfa Romeo's early world championship presence shaped F1's first identity before the constructors' title existed. Its later returns kept the badge connected to the grid.",
  }),
  team({
    id: "brawn-gp",
    constructorName: "Brawn GP",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 2009,
    finalYear: 2009,
    active: false,
    activeSeasons: 1,
    championshipYears: [2009],
    totalConstructorsChampionships: 1,
    totalDriversChampionshipsLinked: 1,
    primaryColor: "#f4ead8",
    secondaryColor: "#7bdc65",
    liveryStripeColor: "#7bdc65",
    profile30Words:
      "Brawn GP is F1's one-season miracle, turning crisis, clever aero interpretation, and calm execution into a double title.",
    longProfile:
      "Brawn GP lasted one season and still became legend. The double-diffuser car and Button's early surge created a championship story that felt impossible even while it unfolded.",
  }),
  team({
    id: "aston-martin",
    constructorName: "Aston Martin",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 2021,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [],
    totalConstructorsChampionships: 0,
    totalDriversChampionshipsLinked: 0,
    primaryColor: "#0f766e",
    secondaryColor: "#111111",
    liveryStripeColor: "#2dd4bf",
    profile30Words:
      "Aston Martin frames modern ambition through heritage branding, new facilities, and a push to become more than a customer-team threat.",
    longProfile:
      "Aston Martin's current F1 project is about converting investment and identity into sustained competitiveness. The brand brings road-car prestige into a factory-scale racing plan.",
  }),
  team({
    id: "haas",
    constructorName: "Haas",
    nationality: "American",
    baseCountry: "United States",
    debutYear: 2016,
    finalYear: null,
    active: true,
    activeSeasons: null,
    championshipYears: [],
    totalConstructorsChampionships: 0,
    totalDriversChampionshipsLinked: 0,
    primaryColor: "#f4ead8",
    secondaryColor: "#111111",
    liveryStripeColor: "#dc2626",
    profile30Words:
      "Haas represents the modern lean constructor model, carrying American identity through technical partnerships and pragmatic survival.",
    longProfile:
      "Haas entered Formula 1 with a different operational model: focused, partnership-heavy, and realistic about scale. Its story is persistence inside a brutal midfield economy.",
  }),
];
