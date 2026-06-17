import { seedDrivers } from "./seed-drivers";
import { seedTeams } from "./seed-teams";
import type { F1Entity, HeritageArtifact } from "./types";
import { entityTitle } from "./utils";

function firstTitle(entity: F1Entity) {
  return entity.championshipYears[0] ?? entity.debutYear;
}

function driverArtifacts(entity: (typeof seedDrivers)[number]): HeritageArtifact[] {
  const titleYear = firstTitle(entity);

  return [
    {
      id: `driver-${entity.id}-helmet`,
      entityId: entity.id,
      entityMode: "driver",
      type: "helmet",
      title: "Signature Helmet",
      year: entity.debutYear,
      description: `${entity.name}'s helmet display uses safe stylized color cues from the archive profile rather than licensed photography.`,
      importance: entity.totalChampionships > 2 ? "legendary" : "major",
      displayPosition: [-2.4, 1.2, -1.4],
      color: entity.helmetColor,
      imageAssetId: entity.image.id,
      vectorText: `${entity.name} helmet ${entity.primaryEra} ${entity.primaryTeam} ${entity.nationality}`,
    },
    {
      id: `driver-${entity.id}-suit`,
      entityId: entity.id,
      entityMode: "driver",
      type: "suit",
      title: "Race Suit Alcove",
      year: entity.debutYear,
      description: `A mannequin-style race suit block keyed to ${entity.primaryTeam}, built as a neutral generated display.`,
      importance: "standard",
      displayPosition: [2.4, 1.1, -1.4],
      color: entity.primaryColor,
      vectorText: `${entity.name} race suit ${entity.primaryTeam} ${entity.teams.join(" ")}`,
    },
    {
      id:
        entity.totalChampionships > 0
          ? `driver-${entity.id}-trophy`
          : `driver-${entity.id}-season-card`,
      entityId: entity.id,
      entityMode: "driver",
      type: entity.totalChampionships > 0 ? "trophy" : "season_card",
      title:
        entity.totalChampionships > 0
          ? `${entity.totalChampionships} World Championship${entity.totalChampionships > 1 ? "s" : ""}`
          : "Career Season Card",
      year: titleYear,
      description:
        entity.totalChampionships > 0
          ? `Gold-highlighted title years: ${entity.championshipYears.join(", ")}.`
          : `A career marker for ${entity.name}'s place in the ${entity.primaryEra}.`,
      importance: entity.totalChampionships > 3 ? "legendary" : "major",
      displayPosition: [0, 1.35, -1.85],
      color: "#cfae5f",
      vectorText: `${entity.name} championship years ${entity.championshipYears.join(" ")} ${entity.primaryEra}`,
    },
    {
      id: `driver-${entity.id}-moment`,
      entityId: entity.id,
      entityMode: "driver",
      type: "framed_moment",
      title: "Framed Era Moment",
      year: titleYear,
      description: entity.bio30Words,
      importance: entity.totalChampionships > 0 ? "major" : "standard",
      displayPosition: [0, 2.35, -1.95],
      color: entity.secondaryColor,
      vectorText: `${entity.name} ${entity.bio30Words} ${entity.longBio}`,
    },
  ];
}

function teamArtifacts(entity: (typeof seedTeams)[number]): HeritageArtifact[] {
  const titleYear = firstTitle(entity);

  return [
    {
      id: `team-${entity.id}-car`,
      entityId: entity.id,
      entityMode: "team",
      type: "car",
      title: "Low-Poly Car Silhouette",
      year: entity.debutYear,
      description: `${entity.constructorName}'s car display is a safe abstract shape with team-color lighting.`,
      importance: entity.totalConstructorsChampionships > 4 ? "legendary" : "major",
      displayPosition: [0, 0.7, -0.65],
      color: entity.primaryColor,
      imageAssetId: entity.image.id,
      vectorText: `${entity.constructorName} car ${entity.baseCountry} ${entity.profile30Words}`,
    },
    {
      id: `team-${entity.id}-factory`,
      entityId: entity.id,
      entityMode: "team",
      type: "framed_moment",
      title: "Factory Wall",
      year: entity.debutYear,
      description: `A factory-floor wall panel for ${entity.constructorName}'s origin and engineering identity.`,
      importance: "standard",
      displayPosition: [-2.65, 1.4, -1.6],
      color: entity.liveryStripeColor,
      vectorText: `${entity.constructorName} factory ${entity.nationality} ${entity.baseCountry}`,
    },
    {
      id:
        entity.totalConstructorsChampionships > 0
          ? `team-${entity.id}-cabinet`
          : `team-${entity.id}-season-card`,
      entityId: entity.id,
      entityMode: "team",
      type: entity.totalConstructorsChampionships > 0 ? "trophy" : "season_card",
      title:
        entity.totalConstructorsChampionships > 0
          ? `${entity.totalConstructorsChampionships} Constructors' Title${entity.totalConstructorsChampionships > 1 ? "s" : ""}`
          : "Constructor Archive Card",
      year: titleYear,
      description:
        entity.totalConstructorsChampionships > 0
          ? `Championship seasons highlighted in gold: ${entity.championshipYears.join(", ")}.`
          : `A team archive card for a constructor still seeking its first constructors' crown.`,
      importance: entity.totalConstructorsChampionships > 4 ? "legendary" : "major",
      displayPosition: [2.65, 1.4, -1.6],
      color: "#cfae5f",
      vectorText: `${entity.constructorName} constructors championships ${entity.championshipYears.join(" ")}`,
    },
    {
      id: `team-${entity.id}-moment`,
      entityId: entity.id,
      entityMode: "team",
      type: "framed_moment",
      title: "Archive Moment",
      year: titleYear,
      description: entity.profile30Words,
      importance: entity.totalConstructorsChampionships > 0 ? "major" : "standard",
      displayPosition: [0, 2.35, -1.95],
      color: entity.secondaryColor,
      vectorText: `${entity.constructorName} ${entity.profile30Words} ${entity.longProfile}`,
    },
  ];
}

export const seedArtifacts: HeritageArtifact[] = [
  ...seedDrivers.flatMap(driverArtifacts),
  ...seedTeams.flatMap(teamArtifacts),
];

export const artifactById = new Map(seedArtifacts.map((artifact) => [artifact.id, artifact]));

export function getSeedArtifactsForEntity(entity: F1Entity) {
  return entity.artifactIds
    .map((id) => artifactById.get(id))
    .filter((artifact): artifact is HeritageArtifact => Boolean(artifact));
}

export function buildArtifactTitle(entity: F1Entity, artifact: HeritageArtifact) {
  return `${entityTitle(entity)} • ${artifact.title}`;
}
