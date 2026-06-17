import { eraForYear } from "./constants";
import { resolveImage } from "./image-provider";
import { generateArtifactsForEntity } from "./seed-artifacts";
import type { DriverEntity } from "./types";
import { careerSpanLabel } from "./utils";

/**
 * Seed drivers. Exact career stat totals (wins/poles/podiums/etc.) are left as
 * `null` ("Data syncing") to avoid fabricating numbers — they are filled in by
 * the Jolpica/OpenF1 sync layer. Championship YEARS are well-documented
 * historical facts and are included. Bios are short, original, non-copyrighted.
 */

interface RawDriver {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  nationality: string;
  countryCode: string;
  dateOfBirth: string | null;
  debutYear: number;
  finalYear: number | null;
  active: boolean;
  championshipYears: number[];
  teams: string[];
  primaryTeam: string;
  primaryColor: string;
  secondaryColor: string;
  helmetColor: string;
  bio30Words: string;
  longBio: string;
  signature: Array<{
    type: "helmet" | "suit" | "car" | "framed_moment" | "season_card";
    title: string;
    year: number | null;
    description: string;
    importance?: "legendary" | "major" | "standard";
  }>;
}

const RAW_DRIVERS: RawDriver[] = [
  {
    id: "juan-manuel-fangio",
    name: "Juan Manuel Fangio",
    givenName: "Juan Manuel",
    familyName: "Fangio",
    nationality: "Argentine",
    countryCode: "ARG",
    dateOfBirth: "1911-06-24",
    debutYear: 1950,
    finalYear: 1958,
    active: false,
    championshipYears: [1951, 1954, 1955, 1956, 1957],
    teams: ["Alfa Romeo", "Maserati", "Mercedes", "Ferrari"],
    primaryTeam: "Mercedes",
    primaryColor: "#5fa8d3",
    secondaryColor: "#d4af37",
    helmetColor: "#1c4f7c",
    bio30Words:
      "The original master of the championship era, winning five titles across four marques with unmatched calm, mechanical sympathy, and an instinct for race craft on perilous circuits.",
    longBio:
      "Juan Manuel Fangio defined Formula 1's earliest decade, claiming five world championships in a span when each race could be fatal. Renowned for adapting to any car, he balanced raw speed with extraordinary control, and his 1957 German Grand Prix comeback remains a touchstone of strategic genius.",
    signature: [
      {
        type: "helmet",
        title: "Pale-blue cork helmet",
        year: 1957,
        description: "A stylized tribute to the era's minimal head protection.",
        importance: "legendary",
      },
      {
        type: "framed_moment",
        title: "1957 Nürburgring charge",
        year: 1957,
        description: "A late-race surge regarded as one of the sport's finest drives.",
        importance: "legendary",
      },
      {
        type: "car",
        title: "Front-engined grand prix machine",
        year: 1955,
        description: "Low-poly homage to the silver front-engined cars of the 1950s.",
      },
    ],
  },
  {
    id: "stirling-moss",
    name: "Stirling Moss",
    givenName: "Stirling",
    familyName: "Moss",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1929-09-17",
    debutYear: 1951,
    finalYear: 1961,
    active: false,
    championshipYears: [],
    teams: ["Mercedes", "Maserati", "Vanwall", "Lotus"],
    primaryTeam: "Vanwall",
    primaryColor: "#0d5c3a",
    secondaryColor: "#f4efe6",
    helmetColor: "#0d5c3a",
    bio30Words:
      "Often called the greatest driver never to win the title, Moss combined sportsmanship and brilliance, finishing championship runner-up repeatedly while becoming a defining British racing icon.",
    longBio:
      "Stirling Moss blended versatility and chivalry into a singular career, excelling across grand prix, sports cars, and endurance events. Though the championship eluded him, his elegant car control and famous sportsmanship made him a benchmark for racing excellence and integrity.",
    signature: [
      {
        type: "framed_moment",
        title: "Versatility across disciplines",
        year: 1955,
        description: "A nod to a career spanning grand prix and sports-car greatness.",
      },
      {
        type: "helmet",
        title: "British racing green helmet",
        year: 1958,
        description: "Stylized period-correct open-face helmet motif.",
      },
    ],
  },
  {
    id: "jim-clark",
    name: "Jim Clark",
    givenName: "Jim",
    familyName: "Clark",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1936-03-04",
    debutYear: 1960,
    finalYear: 1968,
    active: false,
    championshipYears: [1963, 1965],
    teams: ["Lotus"],
    primaryTeam: "Lotus",
    primaryColor: "#00563f",
    secondaryColor: "#f4efe6",
    helmetColor: "#001f54",
    bio30Words:
      "A naturally gifted Scot whose smoothness and pace set new standards, Clark dominated the 1960s with Lotus, winning two titles and reshaping how cars could be driven.",
    longBio:
      "Jim Clark's effortless precision made him the standard-setter of the 1960s. His partnership with Lotus founder Colin Chapman produced groundbreaking, fragile machines that Clark wielded with breathtaking control, leading races by enormous margins before his tragic death in 1968.",
    signature: [
      {
        type: "car",
        title: "Lightweight Lotus single-seater",
        year: 1965,
        description: "Low-poly tribute to Chapman-era innovation.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Dark-blue racing helmet",
        year: 1965,
        description: "Stylized period helmet in deep navy.",
      },
    ],
  },
  {
    id: "jackie-stewart",
    name: "Jackie Stewart",
    givenName: "Jackie",
    familyName: "Stewart",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1939-06-11",
    debutYear: 1965,
    finalYear: 1973,
    active: false,
    championshipYears: [1969, 1971, 1973],
    teams: ["BRM", "Matra", "Tyrrell"],
    primaryTeam: "Tyrrell",
    primaryColor: "#1f4ea1",
    secondaryColor: "#f4efe6",
    helmetColor: "#1f4ea1",
    bio30Words:
      "Three-time champion and tireless safety campaigner, Stewart paired silky speed with a crusade that transformed Formula 1 from a deadly spectacle into a more survivable sport.",
    longBio:
      "Sir Jackie Stewart won three championships while fundamentally changing the sport's relationship with risk. After surviving a frightening crash, he campaigned relentlessly for barriers, medical care, and circuit safety, leaving a legacy measured in lives as much as victories.",
    signature: [
      {
        type: "helmet",
        title: "Tartan-banded helmet",
        year: 1971,
        description: "Stylized helmet motif referencing his Scottish identity.",
        importance: "legendary",
      },
      {
        type: "framed_moment",
        title: "Safety crusade",
        year: 1970,
        description: "A tribute to his campaign that reshaped the sport.",
        importance: "major",
      },
    ],
  },
  {
    id: "niki-lauda",
    name: "Niki Lauda",
    givenName: "Niki",
    familyName: "Lauda",
    nationality: "Austrian",
    countryCode: "AUT",
    dateOfBirth: "1949-02-22",
    debutYear: 1971,
    finalYear: 1985,
    active: false,
    championshipYears: [1975, 1977, 1984],
    teams: ["March", "BRM", "Ferrari", "Brabham", "McLaren"],
    primaryTeam: "Ferrari",
    primaryColor: "#d40000",
    secondaryColor: "#f4efe6",
    helmetColor: "#d40000",
    bio30Words:
      "A cerebral three-time champion whose 1976 comeback from a near-fatal fire became legendary, Lauda blended analytical precision with raw courage across Ferrari and McLaren.",
    longBio:
      "Niki Lauda approached racing like an engineer, extracting performance through calculation and feedback. His harrowing 1976 Nürburgring crash and astonishing return weeks later embodied a fierce will, and his third title with McLaren in 1984 confirmed a methodical, fearless brilliance.",
    signature: [
      {
        type: "framed_moment",
        title: "1976 comeback",
        year: 1976,
        description: "A tribute to one of sport's great returns from injury.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Red sponsor-capped helmet",
        year: 1977,
        description: "Stylized helmet referencing his signature look.",
      },
    ],
  },
  {
    id: "james-hunt",
    name: "James Hunt",
    givenName: "James",
    familyName: "Hunt",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1947-08-29",
    debutYear: 1973,
    finalYear: 1979,
    active: false,
    championshipYears: [1976],
    teams: ["Hesketh", "McLaren", "Wolf"],
    primaryTeam: "McLaren",
    primaryColor: "#ff8000",
    secondaryColor: "#1f1f1f",
    helmetColor: "#1f2f6f",
    bio30Words:
      "Charismatic and fearless, Hunt clinched the dramatic 1976 title in a rain-soaked finale, becoming the embodiment of an era's glamour, danger, and raw competitive fire.",
    longBio:
      "James Hunt's flamboyance masked genuine speed and bravery. His 1976 championship duel with Niki Lauda—decided in torrential rain at the season finale—became one of motorsport's defining stories, capturing the romance and peril of 1970s Formula 1.",
    signature: [
      {
        type: "framed_moment",
        title: "1976 rain-soaked finale",
        year: 1976,
        description: "A tribute to the decisive wet-weather title decider.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Tri-band helmet",
        year: 1976,
        description: "Stylized helmet motif from the championship season.",
      },
    ],
  },
  {
    id: "alain-prost",
    name: "Alain Prost",
    givenName: "Alain",
    familyName: "Prost",
    nationality: "French",
    countryCode: "FRA",
    dateOfBirth: "1955-02-24",
    debutYear: 1980,
    finalYear: 1993,
    active: false,
    championshipYears: [1985, 1986, 1989, 1993],
    teams: ["McLaren", "Renault", "Ferrari", "Williams"],
    primaryTeam: "McLaren",
    primaryColor: "#ff8000",
    secondaryColor: "#c0c0c0",
    helmetColor: "#1f1f8f",
    bio30Words:
      "Nicknamed 'The Professor', Prost won four titles through tactical mastery and tyre management, his calculated brilliance defining—and clashing with—one of F1's fiercest rivalries.",
    longBio:
      "Alain Prost turned racing into strategy, conserving equipment and outthinking rivals to claim four championships. His rivalry with Ayrton Senna produced some of the sport's most charged moments, contrasting cerebral control against raw intensity in an unforgettable era.",
    signature: [
      {
        type: "framed_moment",
        title: "The Senna–Prost rivalry",
        year: 1989,
        description: "A tribute to one of F1's most defining rivalries.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Blue-and-white helmet",
        year: 1989,
        description: "Stylized helmet motif from his McLaren years.",
      },
    ],
  },
  {
    id: "ayrton-senna",
    name: "Ayrton Senna",
    givenName: "Ayrton",
    familyName: "Senna",
    nationality: "Brazilian",
    countryCode: "BRA",
    dateOfBirth: "1960-03-21",
    debutYear: 1984,
    finalYear: 1994,
    active: false,
    championshipYears: [1988, 1990, 1991],
    teams: ["Toleman", "Lotus", "McLaren", "Williams"],
    primaryTeam: "McLaren",
    primaryColor: "#ff8000",
    secondaryColor: "#e10600",
    helmetColor: "#f2d600",
    bio30Words:
      "A transcendent talent whose qualifying genius and wet-weather mastery defined an era, Senna won three titles and remains an enduring symbol of speed, intensity, and devotion.",
    longBio:
      "Ayrton Senna raced with a spiritual intensity that set him apart. Untouchable over a single lap and mesmerising in the rain, he won three championships and elevated the sport's artistry. His death in 1994 spurred sweeping safety reforms and cemented an immortal legacy.",
    signature: [
      {
        type: "helmet",
        title: "Yellow-green-blue helmet",
        year: 1988,
        description: "Stylized tribute to his iconic Brazilian colours.",
        importance: "legendary",
      },
      {
        type: "framed_moment",
        title: "Wet-weather mastery",
        year: 1991,
        description: "A tribute to his celebrated command of the rain.",
        importance: "legendary",
      },
      {
        type: "car",
        title: "Turbo-era McLaren",
        year: 1988,
        description: "Low-poly homage to the dominant late-1980s McLaren.",
      },
    ],
  },
  {
    id: "nigel-mansell",
    name: "Nigel Mansell",
    givenName: "Nigel",
    familyName: "Mansell",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1953-08-08",
    debutYear: 1980,
    finalYear: 1995,
    active: false,
    championshipYears: [1992],
    teams: ["Lotus", "Williams", "Ferrari", "McLaren"],
    primaryTeam: "Williams",
    primaryColor: "#0a3d91",
    secondaryColor: "#ffd100",
    helmetColor: "#0a3d91",
    bio30Words:
      "A fierce, fan-favourite charger, Mansell finally claimed the 1992 title in a dominant Williams after years of near-misses, his aggressive, never-give-up style endearing him to millions.",
    longBio:
      "Nigel Mansell's career was a study in perseverance and spectacle. Famous for fearless overtakes and relentless commitment, he endured heartbreak before conquering the championship in 1992 with the technologically advanced Williams, becoming one of Britain's most beloved racers.",
    signature: [
      {
        type: "car",
        title: "Active-suspension Williams",
        year: 1992,
        description: "Low-poly tribute to the dominant 1992 machine.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Red-and-white helmet",
        year: 1992,
        description: "Stylized helmet motif from his title season.",
      },
    ],
  },
  {
    id: "michael-schumacher",
    name: "Michael Schumacher",
    givenName: "Michael",
    familyName: "Schumacher",
    nationality: "German",
    countryCode: "DEU",
    dateOfBirth: "1969-01-03",
    debutYear: 1991,
    finalYear: 2012,
    active: false,
    championshipYears: [1994, 1995, 2000, 2001, 2002, 2003, 2004],
    teams: ["Jordan", "Benetton", "Ferrari", "Mercedes"],
    primaryTeam: "Ferrari",
    primaryColor: "#d40000",
    secondaryColor: "#f4efe6",
    helmetColor: "#d40000",
    bio30Words:
      "A relentless seven-time champion who redefined professionalism and fitness, Schumacher led Ferrari's historic revival and set records that defined modern Formula 1 for a generation.",
    longBio:
      "Michael Schumacher fused extraordinary talent with a tireless work ethic, transforming Ferrari into a dynasty in the early 2000s. His precision, stamina, and team-building obsession set new benchmarks, and his record haul of championships shaped expectations for every driver who followed.",
    signature: [
      {
        type: "car",
        title: "Early-2000s Ferrari",
        year: 2002,
        description: "Low-poly homage to the dominant Ferrari era.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Red-and-white championship helmet",
        year: 2004,
        description: "Stylized helmet motif from the dynasty years.",
      },
      {
        type: "framed_moment",
        title: "Ferrari's revival",
        year: 2000,
        description: "A tribute to ending Ferrari's long title drought.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "mika-hakkinen",
    name: "Mika Häkkinen",
    givenName: "Mika",
    familyName: "Häkkinen",
    nationality: "Finnish",
    countryCode: "FIN",
    dateOfBirth: "1968-09-28",
    debutYear: 1991,
    finalYear: 2001,
    active: false,
    championshipYears: [1998, 1999],
    teams: ["Lotus", "McLaren"],
    primaryTeam: "McLaren",
    primaryColor: "#c0c0c0",
    secondaryColor: "#e10600",
    helmetColor: "#0033a0",
    bio30Words:
      "The 'Flying Finn' whose blistering pace and quiet composure earned two titles, Häkkinen was the rival Schumacher most respected during their classic late-1990s duels.",
    longBio:
      "Mika Häkkinen combined raw speed with stoic calm, recovering from a life-threatening 1995 crash to win back-to-back championships. His wheel-to-wheel battles with Michael Schumacher, including a legendary Spa overtake, defined the turn-of-the-millennium era.",
    signature: [
      {
        type: "framed_moment",
        title: "1998 title fight",
        year: 1998,
        description: "A tribute to his breakthrough championship season.",
        importance: "major",
      },
      {
        type: "helmet",
        title: "Blue-white Finnish helmet",
        year: 1999,
        description: "Stylized helmet motif in Finland's colours.",
      },
    ],
  },
  {
    id: "fernando-alonso",
    name: "Fernando Alonso",
    givenName: "Fernando",
    familyName: "Alonso",
    nationality: "Spanish",
    countryCode: "ESP",
    dateOfBirth: "1981-07-29",
    debutYear: 2001,
    finalYear: null,
    active: true,
    championshipYears: [2005, 2006],
    teams: ["Minardi", "Renault", "McLaren", "Ferrari", "Alpine", "Aston Martin"],
    primaryTeam: "Renault",
    primaryColor: "#fff200",
    secondaryColor: "#003a70",
    helmetColor: "#003a70",
    bio30Words:
      "A two-time champion of remarkable longevity, Alonso broke records as F1's youngest champion of his era and remains a benchmark for racecraft, adaptability, and competitive ferocity.",
    longBio:
      "Fernando Alonso ended Schumacher's dominance with consecutive titles, then sustained elite performance for two decades. Famed for extracting maximum results from any car and for ruthless wheel-to-wheel skill, he is widely regarded as one of the most complete racers of his generation.",
    signature: [
      {
        type: "car",
        title: "Mid-2000s Renault",
        year: 2006,
        description: "Low-poly tribute to his championship-winning Renault.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Blue-and-yellow helmet",
        year: 2006,
        description: "Stylized helmet motif from his title years.",
      },
    ],
  },
  {
    id: "kimi-raikkonen",
    name: "Kimi Räikkönen",
    givenName: "Kimi",
    familyName: "Räikkönen",
    nationality: "Finnish",
    countryCode: "FIN",
    dateOfBirth: "1979-10-17",
    debutYear: 2001,
    finalYear: 2021,
    active: false,
    championshipYears: [2007],
    teams: ["Sauber", "McLaren", "Ferrari", "Lotus", "Alfa Romeo"],
    primaryTeam: "Ferrari",
    primaryColor: "#d40000",
    secondaryColor: "#f4efe6",
    helmetColor: "#0033a0",
    bio30Words:
      "The 'Iceman', famed for cool detachment and natural speed, won the 2007 title for Ferrari in a dramatic finale and became one of the sport's most beloved characters.",
    longBio:
      "Kimi Räikkönen paired raw, instinctive pace with a famously unflappable demeanour. His 2007 championship—won by a single point at the season's final round—capped a career defined by understated brilliance and one of the longest, most popular tenures in F1 history.",
    signature: [
      {
        type: "framed_moment",
        title: "2007 final-round title",
        year: 2007,
        description: "A tribute to his last-gasp championship.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Iceman helmet",
        year: 2007,
        description: "Stylized helmet motif from his Ferrari title year.",
      },
    ],
  },
  {
    id: "sebastian-vettel",
    name: "Sebastian Vettel",
    givenName: "Sebastian",
    familyName: "Vettel",
    nationality: "German",
    countryCode: "DEU",
    dateOfBirth: "1987-07-03",
    debutYear: 2007,
    finalYear: 2022,
    active: false,
    championshipYears: [2010, 2011, 2012, 2013],
    teams: ["BMW Sauber", "Toro Rosso", "Red Bull Racing", "Ferrari", "Aston Martin"],
    primaryTeam: "Red Bull Racing",
    primaryColor: "#0600ef",
    secondaryColor: "#ffd100",
    helmetColor: "#0600ef",
    bio30Words:
      "A four-time champion who dominated the early-2010s with Red Bull, Vettel paired exceptional qualifying speed with relentless consistency before becoming a respected statesman of the sport.",
    longBio:
      "Sebastian Vettel rose rapidly to claim four consecutive championships with Red Bull, mastering the blown-diffuser era through precision and racecraft. Later admired for his sportsmanship and advocacy, he combined youthful brilliance with a thoughtful maturity that broadened his legacy.",
    signature: [
      {
        type: "car",
        title: "Blown-diffuser Red Bull",
        year: 2011,
        description: "Low-poly tribute to the dominant early-2010s machine.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Navy championship helmet",
        year: 2013,
        description: "Stylized helmet motif from his title-winning years.",
      },
    ],
  },
  {
    id: "lewis-hamilton",
    name: "Lewis Hamilton",
    givenName: "Lewis",
    familyName: "Hamilton",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1985-01-07",
    debutYear: 2007,
    finalYear: null,
    active: true,
    championshipYears: [2008, 2014, 2015, 2017, 2018, 2019, 2020],
    teams: ["McLaren", "Mercedes", "Ferrari"],
    primaryTeam: "Mercedes",
    primaryColor: "#00d2be",
    secondaryColor: "#c0c0c0",
    helmetColor: "#fbd400",
    bio30Words:
      "A record-equalling seven-time champion and the sport's most statistically successful driver, Hamilton fused blistering pace with longevity while becoming a global advocate for diversity.",
    longBio:
      "Lewis Hamilton transformed records and reach alike, dominating the hybrid era with Mercedes while becoming a cultural force beyond the grid. Blending raw speed, consistency, and adaptability across a long career, he stands among the most decorated and influential figures in Formula 1.",
    signature: [
      {
        type: "car",
        title: "Hybrid-era Mercedes",
        year: 2019,
        description: "Low-poly homage to the dominant hybrid Mercedes.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Yellow championship helmet",
        year: 2020,
        description: "Stylized helmet motif from his record-equalling season.",
      },
      {
        type: "framed_moment",
        title: "Record-equalling titles",
        year: 2020,
        description: "A tribute to matching the all-time championship record.",
        importance: "legendary",
      },
    ],
  },
  {
    id: "max-verstappen",
    name: "Max Verstappen",
    givenName: "Max",
    familyName: "Verstappen",
    nationality: "Dutch",
    countryCode: "NLD",
    dateOfBirth: "1997-09-30",
    debutYear: 2015,
    finalYear: null,
    active: true,
    championshipYears: [2021, 2022, 2023, 2024],
    teams: ["Toro Rosso", "Red Bull Racing"],
    primaryTeam: "Red Bull Racing",
    primaryColor: "#0600ef",
    secondaryColor: "#ff1801",
    helmetColor: "#ff1801",
    bio30Words:
      "A ferociously fast modern champion, Verstappen became F1's youngest race winner before dominating the ground-effect era with Red Bull, combining aggression, precision, and relentless consistency.",
    longBio:
      "Max Verstappen burst onto the grid as a teenager and matured into a dominant force, mastering the ground-effect regulations with Red Bull. His blend of fearless overtaking, qualifying speed, and race-long consistency has defined the sport's most recent championship-winning era.",
    signature: [
      {
        type: "car",
        title: "Ground-effect Red Bull",
        year: 2023,
        description: "Low-poly tribute to the dominant modern Red Bull.",
        importance: "legendary",
      },
      {
        type: "helmet",
        title: "Red-and-blue helmet",
        year: 2023,
        description: "Stylized helmet motif from his championship run.",
      },
    ],
  },
  {
    id: "charles-leclerc",
    name: "Charles Leclerc",
    givenName: "Charles",
    familyName: "Leclerc",
    nationality: "Monégasque",
    countryCode: "MCO",
    dateOfBirth: "1997-10-16",
    debutYear: 2018,
    finalYear: null,
    active: true,
    championshipYears: [],
    teams: ["Sauber", "Ferrari"],
    primaryTeam: "Ferrari",
    primaryColor: "#d40000",
    secondaryColor: "#f4efe6",
    helmetColor: "#d40000",
    bio30Words:
      "A blazing qualifier and Ferrari's modern standard-bearer, Leclerc combines emotional connection to the Scuderia with exceptional one-lap pace and a growing reputation for racecraft.",
    longBio:
      "Charles Leclerc carries the weight of Ferrari expectation with style and speed, excelling especially in qualifying. A poignant home connection to Monaco and a fierce competitive drive have made him one of the most watched talents of the current generation.",
    signature: [
      {
        type: "helmet",
        title: "Red home-race helmet",
        year: 2022,
        description: "Stylized helmet motif in Ferrari red.",
      },
      {
        type: "framed_moment",
        title: "Pole-position pace",
        year: 2022,
        description: "A tribute to his celebrated qualifying speed.",
      },
    ],
  },
  {
    id: "lando-norris",
    name: "Lando Norris",
    givenName: "Lando",
    familyName: "Norris",
    nationality: "British",
    countryCode: "GBR",
    dateOfBirth: "1999-11-13",
    debutYear: 2019,
    finalYear: null,
    active: true,
    championshipYears: [],
    teams: ["McLaren"],
    primaryTeam: "McLaren",
    primaryColor: "#ff8000",
    secondaryColor: "#47c7fc",
    helmetColor: "#ff8000",
    bio30Words:
      "A fast, popular McLaren talent who broke through to grand prix victory, Norris pairs natural pace with a relatable personality that has expanded the sport's modern audience.",
    longBio:
      "Lando Norris blends serious speed with an approachable charm that has broadened Formula 1's reach. As McLaren returned to the front of the grid, he converted long-awaited potential into race wins, establishing himself among the leading contenders of the current era.",
    signature: [
      {
        type: "helmet",
        title: "Fluo papaya helmet",
        year: 2024,
        description: "Stylized helmet motif in McLaren papaya.",
      },
      {
        type: "framed_moment",
        title: "Maiden grand prix win",
        year: 2024,
        description: "A tribute to his breakthrough first victory.",
        importance: "major",
      },
    ],
  },
];

function buildDriver(raw: RawDriver): DriverEntity {
  const image = resolveImage({
    entityId: raw.id,
    entityMode: "driver",
    kind: "portrait",
    alt: `Stylized silhouette representing ${raw.name}`,
    primaryColor: raw.primaryColor,
    secondaryColor: raw.secondaryColor,
  });

  const artifacts = generateArtifactsForEntity({
    entityId: raw.id,
    entityMode: "driver",
    displayName: raw.name,
    championshipYears: raw.championshipYears,
    primaryColor: raw.primaryColor,
    secondaryColor: raw.secondaryColor,
    signature: raw.signature,
  });

  return {
    id: raw.id,
    mode: "driver",
    name: raw.name,
    givenName: raw.givenName,
    familyName: raw.familyName,
    slug: raw.id,
    nationality: raw.nationality,
    countryCode: raw.countryCode,
    dateOfBirth: raw.dateOfBirth,
    debutYear: raw.debutYear,
    finalYear: raw.finalYear,
    active: raw.active,
    careerSpanLabel: careerSpanLabel(raw.debutYear, raw.finalYear),
    championshipYears: raw.championshipYears,
    totalChampionships: raw.championshipYears.length,
    wins: null,
    poles: null,
    podiums: null,
    fastestLaps: null,
    entries: null,
    teams: raw.teams,
    primaryEra: eraForYear(raw.debutYear),
    primaryTeam: raw.primaryTeam,
    primaryColor: raw.primaryColor,
    secondaryColor: raw.secondaryColor,
    helmetColor: raw.helmetColor,
    bio30Words: raw.bio30Words,
    longBio: raw.longBio,
    image,
    artifacts,
    sourceRefs: [{ source: "seed", ref: raw.id, syncedAt: null }],
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

export const SEED_DRIVERS: DriverEntity[] = RAW_DRIVERS.map(buildDriver);
