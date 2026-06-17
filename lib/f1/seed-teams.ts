import { eraForYear } from "./constants";
import { resolveImage } from "./image-provider";
import { generateArtifactsForEntity } from "./seed-artifacts";
import type { TeamEntity } from "./types";
import { careerSpanLabel } from "./utils";

/**
 * Seed teams (constructors). Exact win/pole/podium totals are left `null`
 * ("Data syncing") to avoid fabrication; Jolpica sync fills them in.
 * Constructors' championship YEARS are documented historical facts and are
 * included. Profiles are short, original, non-copyrighted summaries.
 */

interface RawTeam {
  id: string;
  constructorName: string;
  nationality: string;
  baseCountry: string;
  debutYear: number;
  finalYear: number | null;
  active: boolean;
  championshipYears: number[];
  driversTitlesLinked: number;
  primaryColor: string;
  secondaryColor: string;
  liveryStripeColor: string;
  profile30Words: string;
  longProfile: string;
  signature: Array<{
    type: "helmet" | "suit" | "car" | "framed_moment" | "season_card";
    title: string;
    year: number | null;
    description: string;
    importance?: "legendary" | "major" | "standard";
  }>;
}

const RAW_TEAMS: RawTeam[] = [
  {
    id: "ferrari",
    constructorName: "Ferrari",
    nationality: "Italian",
    baseCountry: "Italy",
    debutYear: 1950,
    finalYear: null,
    active: true,
    championshipYears: [
      1961, 1964, 1975, 1976, 1977, 1979, 1982, 1983, 1999, 2000, 2001, 2002,
      2003, 2004, 2007, 2008,
    ],
    driversTitlesLinked: 9,
    primaryColor: "#d40000",
    secondaryColor: "#ffd100",
    liveryStripeColor: "#1f1f1f",
    profile30Words:
      "The only constructor present since 1950, Ferrari is Formula 1's most storied and emotionally charged team, blending Italian passion, engineering heritage, and an unmatched competitive history.",
    longProfile:
      "Scuderia Ferrari embodies the soul of Formula 1, the sole team to contest every season since 1950. Through dynasties and droughts alike, its scarlet cars carry a fervent global following, and its blend of romance, politics, and engineering ambition makes every campaign a national event.",
    signature: [
      {
        type: "car",
        title: "Early-2000s title-winning car",
        year: 2002,
        description: "Low-poly centerpiece honouring the dynasty era.",
        importance: "legendary",
      },
      {
        type: "framed_moment",
        title: "Tifosi devotion",
        year: 2000,
        description: "A tribute to the passionate Ferrari fanbase.",
      },
    ],
  },
  {
    id: "mclaren",
    constructorName: "McLaren",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1966,
    finalYear: null,
    active: true,
    championshipYears: [1974, 1984, 1985, 1988, 1989, 1990, 1991, 1998, 2024],
    driversTitlesLinked: 12,
    primaryColor: "#ff8000",
    secondaryColor: "#47c7fc",
    liveryStripeColor: "#1f1f1f",
    profile30Words:
      "A relentless British powerhouse founded by Bruce McLaren, the team blends innovation and racing pedigree, claiming championships across multiple eras with legendary drivers and engineering excellence.",
    longProfile:
      "McLaren has been a fixture at the front of Formula 1 for decades, pairing technical innovation with a roll-call of legendary drivers. From the dominant late-1980s to a modern resurgence, the team's papaya identity and engineering culture remain central to the sport's story.",
    signature: [
      {
        type: "car",
        title: "Late-1980s dominant car",
        year: 1988,
        description: "Low-poly homage to the era of overwhelming success.",
        importance: "legendary",
      },
      {
        type: "framed_moment",
        title: "Modern resurgence",
        year: 2024,
        description: "A tribute to the team's return to title contention.",
      },
    ],
  },
  {
    id: "williams",
    constructorName: "Williams",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1977,
    finalYear: null,
    active: true,
    championshipYears: [1980, 1981, 1986, 1987, 1992, 1993, 1994, 1996, 1997],
    driversTitlesLinked: 7,
    primaryColor: "#0a3d91",
    secondaryColor: "#ffffff",
    liveryStripeColor: "#e10600",
    profile30Words:
      "An independent British constructor built on engineering grit, Williams dominated the late-1980s and 1990s with technological innovation, becoming one of the sport's most successful privateer teams.",
    longProfile:
      "Williams represents the spirit of the independent racing team, achieving sustained success through engineering ingenuity and determination. Its run of championships in the 1980s and 1990s, powered by pioneering technology, secured a place among Formula 1's greatest constructors.",
    signature: [
      {
        type: "car",
        title: "Technologically advanced 1990s car",
        year: 1992,
        description: "Low-poly tribute to the team's innovation peak.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "mercedes",
    constructorName: "Mercedes",
    nationality: "German",
    baseCountry: "Germany / United Kingdom",
    debutYear: 1954,
    finalYear: null,
    active: true,
    championshipYears: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
    driversTitlesLinked: 9,
    primaryColor: "#00d2be",
    secondaryColor: "#c0c0c0",
    liveryStripeColor: "#000000",
    profile30Words:
      "A marque with deep racing roots, Mercedes returned as a works team and dominated the hybrid era, setting records for sustained constructor success with engineering precision and depth.",
    longProfile:
      "Mercedes blends historic racing heritage with modern dominance. After returning as a full works entry, it mastered the turbo-hybrid regulations to record an unprecedented run of consecutive constructors' championships, defining a benchmark era of operational and engineering excellence.",
    signature: [
      {
        type: "car",
        title: "Dominant hybrid-era car",
        year: 2019,
        description: "Low-poly centerpiece for the hybrid dynasty.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "red-bull-racing",
    constructorName: "Red Bull Racing",
    nationality: "Austrian",
    baseCountry: "United Kingdom",
    debutYear: 2005,
    finalYear: null,
    active: true,
    championshipYears: [2010, 2011, 2012, 2013, 2022, 2023],
    driversTitlesLinked: 7,
    primaryColor: "#0600ef",
    secondaryColor: "#ffd100",
    liveryStripeColor: "#e10600",
    profile30Words:
      "Born from an energy-drink takeover, Red Bull rapidly became a championship force, mastering two distinct technical eras through aerodynamic excellence and bold, agile team management.",
    longProfile:
      "Red Bull Racing transformed from an ambitious newcomer into a dominant constructor, conquering both the blown-diffuser era and the ground-effect regulations. Driven by aerodynamic ingenuity and decisive leadership, it has reshaped the competitive order in two separate generations of the sport.",
    signature: [
      {
        type: "car",
        title: "Ground-effect title car",
        year: 2023,
        description: "Low-poly centerpiece for the modern dominant era.",
        importance: "legendary",
      },
      {
        type: "car",
        title: "Blown-diffuser title car",
        year: 2011,
        description: "Low-poly tribute to the early-2010s success.",
      },
    ],
  },
  {
    id: "lotus",
    constructorName: "Lotus",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1958,
    finalYear: 1994,
    active: false,
    championshipYears: [1963, 1965, 1968, 1970, 1972, 1973, 1978],
    driversTitlesLinked: 6,
    primaryColor: "#00563f",
    secondaryColor: "#ffd100",
    liveryStripeColor: "#000000",
    profile30Words:
      "A revolutionary British constructor led by Colin Chapman, Lotus pioneered monocoques, ground effect, and aerodynamics, reshaping racing-car design and winning multiple championships through fearless innovation.",
    longProfile:
      "Team Lotus was the great innovator of Formula 1, introducing concepts that reshaped the sport—from the monocoque chassis to ground-effect aerodynamics. Under Colin Chapman's restless vision, it claimed multiple titles while pushing the boundaries of what a racing car could be.",
    signature: [
      {
        type: "car",
        title: "Ground-effect pioneer",
        year: 1978,
        description: "Low-poly tribute to the innovation that changed F1.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "renault",
    constructorName: "Renault",
    nationality: "French",
    baseCountry: "France",
    debutYear: 1977,
    finalYear: 2020,
    active: false,
    championshipYears: [2005, 2006],
    driversTitlesLinked: 2,
    primaryColor: "#fff200",
    secondaryColor: "#003a70",
    liveryStripeColor: "#000000",
    profile30Words:
      "A turbo-era pioneer and mid-2000s champion, Renault introduced turbocharging to Formula 1 and later ended a dominant dynasty with back-to-back titles powered by agility and innovation.",
    longProfile:
      "Renault holds a pivotal place in Formula 1 history, pioneering turbo power in the late 1970s and returning as a works team to claim consecutive championships in the mid-2000s. Its blend of engineering ambition and racing pragmatism left a lasting technical legacy.",
    signature: [
      {
        type: "car",
        title: "Mid-2000s champion car",
        year: 2006,
        description: "Low-poly tribute to the championship-winning machine.",
        importance: "major",
      },
    ],
  },
  {
    id: "brabham",
    constructorName: "Brabham",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1962,
    finalYear: 1992,
    active: false,
    championshipYears: [1966, 1967],
    driversTitlesLinked: 4,
    primaryColor: "#1f4ea1",
    secondaryColor: "#ffffff",
    liveryStripeColor: "#e10600",
    profile30Words:
      "Founded by world champion Jack Brabham, the team blended driver brilliance and bold engineering, winning championships and famously experimenting with radical aerodynamic and mechanical concepts.",
    longProfile:
      "Brabham combined the talents of a world-champion founder with audacious engineering, claiming titles in the 1960s and pioneering inventive concepts in later decades. Its willingness to challenge convention made it one of the most distinctive constructors of its time.",
    signature: [
      {
        type: "car",
        title: "Innovative grand prix car",
        year: 1966,
        description: "Low-poly tribute to the team's championship era.",
        importance: "major",
      },
    ],
  },
  {
    id: "benetton",
    constructorName: "Benetton",
    nationality: "Italian",
    baseCountry: "United Kingdom",
    debutYear: 1986,
    finalYear: 2001,
    active: false,
    championshipYears: [1995],
    driversTitlesLinked: 2,
    primaryColor: "#00a651",
    secondaryColor: "#0033a0",
    liveryStripeColor: "#ffd100",
    profile30Words:
      "A vibrant, ambitious team that launched a future legend's championship career, Benetton combined aggressive engineering and colourful branding to win a constructors' title in the mid-1990s.",
    longProfile:
      "Benetton brought colour and ambition to the grid, rising rapidly to title contention in the 1990s. The team's championship success, built on sharp engineering and a generational driving talent, marked it as a key chapter in Formula 1's transition into the modern era.",
    signature: [
      {
        type: "car",
        title: "Mid-1990s champion car",
        year: 1995,
        description: "Low-poly tribute to the constructors' title season.",
        importance: "major",
      },
    ],
  },
  {
    id: "tyrrell",
    constructorName: "Tyrrell",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1970,
    finalYear: 1998,
    active: false,
    championshipYears: [1971],
    driversTitlesLinked: 3,
    primaryColor: "#1f4ea1",
    secondaryColor: "#ffffff",
    liveryStripeColor: "#003a70",
    profile30Words:
      "A principled independent team led by Ken Tyrrell, famed for championship success and the daring six-wheeled experiment that remains one of Formula 1's most memorable innovations.",
    longProfile:
      "Tyrrell embodied the resourceful independent constructor, winning a championship in the early 1970s and later capturing imaginations with its radical six-wheeled car. Its blend of integrity and inventiveness left an enduring mark on the sport's engineering folklore.",
    signature: [
      {
        type: "car",
        title: "Championship-era car",
        year: 1971,
        description: "Low-poly tribute to the team's title success.",
        importance: "major",
      },
    ],
  },
  {
    id: "cooper",
    constructorName: "Cooper",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 1950,
    finalYear: 1969,
    active: false,
    championshipYears: [1959, 1960],
    driversTitlesLinked: 2,
    primaryColor: "#00563f",
    secondaryColor: "#ffffff",
    liveryStripeColor: "#e10600",
    profile30Words:
      "The team that revolutionised Formula 1 by moving the engine behind the driver, Cooper's rear-engined breakthrough delivered championships and permanently changed racing-car design.",
    longProfile:
      "Cooper changed Formula 1 forever by pioneering the rear-engined layout, a concept the entire grid soon adopted. Its back-to-back championships at the end of the 1950s confirmed a design revolution that defined the modern racing car.",
    signature: [
      {
        type: "car",
        title: "Rear-engined revolution",
        year: 1959,
        description: "Low-poly tribute to the layout that changed F1.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "alfa-romeo",
    constructorName: "Alfa Romeo",
    nationality: "Italian",
    baseCountry: "Italy / Switzerland",
    debutYear: 1950,
    finalYear: 2023,
    active: false,
    championshipYears: [],
    driversTitlesLinked: 2,
    primaryColor: "#900000",
    secondaryColor: "#ffffff",
    liveryStripeColor: "#1f1f1f",
    profile30Words:
      "An iconic Italian marque present at the championship's birth, Alfa Romeo won the first drivers' titles and later returned as a long-standing name on the modern grid.",
    longProfile:
      "Alfa Romeo's red cars helped launch the world championship, claiming the earliest drivers' titles. Across decades the storied marque appeared in various guises, its heritage and Italian identity remaining a thread connecting Formula 1's origins to the modern era.",
    signature: [
      {
        type: "car",
        title: "Championship-era grand prix car",
        year: 1950,
        description: "Low-poly tribute to the sport's earliest titles.",
        importance: "major",
      },
    ],
  },
  {
    id: "brawn-gp",
    constructorName: "Brawn GP",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 2009,
    finalYear: 2009,
    active: false,
    championshipYears: [2009],
    driversTitlesLinked: 1,
    primaryColor: "#cddc00",
    secondaryColor: "#1f1f1f",
    liveryStripeColor: "#ffffff",
    profile30Words:
      "A fairy-tale single-season team that rose from a withdrawing manufacturer, Brawn GP won both championships in its only year through a clever aerodynamic interpretation and resilient spirit.",
    longProfile:
      "Brawn GP is one of Formula 1's great underdog stories: formed from a departing manufacturer's ashes, it seized a regulatory opportunity to win both championships in its only season. The improbable triumph remains a celebrated symbol of ingenuity and determination.",
    signature: [
      {
        type: "car",
        title: "Double-diffuser sensation",
        year: 2009,
        description: "Low-poly tribute to the fairy-tale championship car.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "aston-martin",
    constructorName: "Aston Martin",
    nationality: "British",
    baseCountry: "United Kingdom",
    debutYear: 2021,
    finalYear: null,
    active: true,
    championshipYears: [],
    driversTitlesLinked: 0,
    primaryColor: "#00665e",
    secondaryColor: "#cddc00",
    liveryStripeColor: "#1f1f1f",
    profile30Words:
      "A storied luxury marque returned to Formula 1 with ambition and investment, building a modern works team aiming to climb the grid toward championship contention.",
    longProfile:
      "Aston Martin's modern works entry pairs a legendary road-car name with serious championship ambition. Backed by significant investment in facilities and talent, the team represents a contemporary push to convert heritage and resources into front-running performance.",
    signature: [
      {
        type: "car",
        title: "Modern works car",
        year: 2023,
        description: "Low-poly tribute to the team's ambitious era.",
      },
    ],
  },
  {
    id: "haas",
    constructorName: "Haas",
    nationality: "American",
    baseCountry: "United States",
    debutYear: 2016,
    finalYear: null,
    active: true,
    championshipYears: [],
    driversTitlesLinked: 0,
    primaryColor: "#b6babd",
    secondaryColor: "#e10600",
    liveryStripeColor: "#1f1f1f",
    profile30Words:
      "The first American team in decades, Haas pioneered a lean technical-partnership model, proving a small, focused operation could compete on Formula 1's demanding global stage.",
    longProfile:
      "Haas brought an American identity and a pragmatic business model to Formula 1, leaning on technical partnerships to punch above its size. As a compact, efficient operation, it demonstrated a modern route for newcomers to enter and survive at the sport's highest level.",
    signature: [
      {
        type: "car",
        title: "Partnership-model car",
        year: 2022,
        description: "Low-poly tribute to the lean American operation.",
      },
    ],
  },
];

function buildTeam(raw: RawTeam): TeamEntity {
  const image = resolveImage({
    entityId: raw.id,
    entityMode: "team",
    kind: "team-card",
    alt: `Stylized livery card representing ${raw.constructorName}`,
    primaryColor: raw.primaryColor,
    secondaryColor: raw.secondaryColor,
  });

  const artifacts = generateArtifactsForEntity({
    entityId: raw.id,
    entityMode: "team",
    displayName: raw.constructorName,
    championshipYears: raw.championshipYears,
    primaryColor: raw.primaryColor,
    secondaryColor: raw.secondaryColor,
    signature: raw.signature,
  });

  const activeSeasons =
    raw.finalYear === null
      ? null
      : Math.max(1, raw.finalYear - raw.debutYear + 1);

  return {
    id: raw.id,
    mode: "team",
    constructorName: raw.constructorName,
    slug: raw.id,
    nationality: raw.nationality,
    baseCountry: raw.baseCountry,
    debutYear: raw.debutYear,
    finalYear: raw.finalYear,
    active: raw.active,
    activeSeasons,
    championshipYears: raw.championshipYears,
    totalConstructorsChampionships: raw.championshipYears.length,
    totalDriversChampionshipsLinked: raw.driversTitlesLinked,
    wins: null,
    poles: null,
    podiums: null,
    primaryColor: raw.primaryColor,
    secondaryColor: raw.secondaryColor,
    liveryStripeColor: raw.liveryStripeColor,
    profile30Words: raw.profile30Words,
    longProfile: raw.longProfile,
    image,
    artifacts,
    sourceRefs: [{ source: "seed", ref: raw.id, syncedAt: null }],
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

export const SEED_TEAMS: TeamEntity[] = RAW_TEAMS.map(buildTeam);
