import type {
  Artifact,
  ArtifactImportance,
  ArtifactType,
  F1EntityMode,
} from "./types";

/**
 * Deterministic artifact builders. Artifacts are stylized museum exhibits —
 * they carry no copyrighted imagery and use generated fallback visuals.
 */

interface BuildArtifactArgs {
  entityId: string;
  entityMode: F1EntityMode;
  type: ArtifactType;
  title: string;
  year: number | null;
  description: string;
  importance: ArtifactImportance;
  index: number;
  color: string;
}

export function buildArtifact(args: BuildArtifactArgs): Artifact {
  const { entityId, entityMode, type, title, year, description, importance, index, color } =
    args;
  const id = `${entityMode}-${entityId}-${type}-${year ?? "x"}-${index}`;
  return {
    id,
    entityId,
    entityMode,
    type,
    title,
    year,
    description,
    importance,
    displayPosition: shelfPosition(index),
    color,
    imageAssetId: null,
    vectorText: buildArtifactVectorText({ title, type, year, description }),
  };
}

/** Lays artifacts out around a room on a stable grid. */
function shelfPosition(index: number): { x: number; y: number; z: number } {
  const perRow = 4;
  const row = Math.floor(index / perRow);
  const col = index % perRow;
  const x = (col - (perRow - 1) / 2) * 1.6;
  const z = -2 - row * 1.6;
  const y = 0;
  return { x, y, z };
}

export function buildArtifactVectorText(args: {
  title: string;
  type: ArtifactType;
  year: number | null;
  description: string;
}): string {
  const { title, type, year, description } = args;
  return [
    title,
    type.replace(/_/g, " "),
    year ? `year ${year}` : "",
    description,
  ]
    .filter(Boolean)
    .join(". ");
}

/**
 * Generates a coherent set of artifacts for an entity from its championship
 * years plus a handful of signature exhibits. Pure + deterministic.
 */
export function generateArtifactsForEntity(opts: {
  entityId: string;
  entityMode: F1EntityMode;
  displayName: string;
  championshipYears: number[];
  primaryColor: string;
  secondaryColor: string;
  signature: Array<{
    type: ArtifactType;
    title: string;
    year: number | null;
    description: string;
    importance?: ArtifactImportance;
  }>;
}): Artifact[] {
  const {
    entityId,
    entityMode,
    displayName,
    championshipYears,
    primaryColor,
    secondaryColor,
    signature,
  } = opts;

  const artifacts: Artifact[] = [];
  let index = 0;

  // A championship trophy for each title year.
  for (const year of championshipYears) {
    artifacts.push(
      buildArtifact({
        entityId,
        entityMode,
        type: "trophy",
        title: `${year} World Championship`,
        year,
        description:
          entityMode === "driver"
            ? `${displayName} secured the drivers' world championship in ${year}.`
            : `${displayName} won the constructors' world championship in ${year}.`,
        importance: "legendary",
        index: index++,
        color: secondaryColor,
      }),
    );
  }

  // Signature exhibits (helmet, suit, car, framed moments, season cards).
  for (const sig of signature) {
    artifacts.push(
      buildArtifact({
        entityId,
        entityMode,
        type: sig.type,
        title: sig.title,
        year: sig.year,
        description: sig.description,
        importance: sig.importance ?? "major",
        index: index++,
        color: sig.type === "helmet" || sig.type === "suit" ? primaryColor : secondaryColor,
      }),
    );
  }

  return artifacts;
}
