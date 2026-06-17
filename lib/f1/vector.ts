import { Index } from "@upstash/vector";
import { getVectorConfig, isVectorConfigured } from "./env";
import type {
  Artifact,
  F1EntityMode,
  HeritageEntity,
  SearchResult,
} from "./types";

/**
 * Upstash Vector layer — used ONLY for semantic discovery/search.
 * Exact stats never come from here; they come from the deterministic data
 * layer. When env vars are missing, every function degrades gracefully and the
 * caller falls back to deterministic local search.
 */

export interface VectorMetadata {
  kind: "entity" | "artifact";
  mode: F1EntityMode;
  entityId: string;
  title: string;
  subtitle: string;
  artifactId?: string;
}

let cachedIndex: Index | null = null;

export function getVectorIndex(): Index | null {
  if (!isVectorConfigured()) return null;
  if (cachedIndex) return cachedIndex;
  const config = getVectorConfig();
  if (!config) return null;
  cachedIndex = new Index({ url: config.url, token: config.token });
  return cachedIndex;
}

export function buildEntityVectorText(entity: HeritageEntity): string {
  if (entity.mode === "driver") {
    return [
      entity.name,
      entity.nationality,
      `debut ${entity.debutYear}`,
      entity.active ? "active driver" : "retired driver",
      `${entity.totalChampionships} championships`,
      entity.championshipYears.length
        ? `champion in ${entity.championshipYears.join(", ")}`
        : "no championships",
      `primary era ${entity.primaryEra}`,
      `teams ${entity.teams.join(", ")}`,
      entity.bio30Words,
    ].join(". ");
  }
  return [
    entity.constructorName,
    entity.nationality,
    `debut ${entity.debutYear}`,
    entity.active ? "active constructor" : "historic constructor",
    `${entity.totalConstructorsChampionships} constructors championships`,
    entity.championshipYears.length
      ? `constructors champion in ${entity.championshipYears.join(", ")}`
      : "no constructors championships",
    entity.profile30Words,
  ].join(". ");
}

export function buildArtifactVectorText(artifact: Artifact): string {
  return [
    artifact.title,
    artifact.type.replace(/_/g, " "),
    artifact.year ? `year ${artifact.year}` : "",
    artifact.importance,
    artifact.description,
  ]
    .filter(Boolean)
    .join(". ");
}

export async function indexEntity(entity: HeritageEntity): Promise<boolean> {
  const index = getVectorIndex();
  if (!index) return false;
  const title =
    entity.mode === "driver" ? entity.name : entity.constructorName;
  const subtitle =
    entity.mode === "driver"
      ? `${entity.nationality} · ${entity.careerSpanLabel}`
      : `${entity.nationality} · since ${entity.debutYear}`;
  await index.upsert({
    id: `entity:${entity.mode}:${entity.id}`,
    data: buildEntityVectorText(entity),
    metadata: {
      kind: "entity",
      mode: entity.mode,
      entityId: entity.id,
      title,
      subtitle,
    } satisfies VectorMetadata,
  });
  return true;
}

export async function indexArtifact(artifact: Artifact): Promise<boolean> {
  const index = getVectorIndex();
  if (!index) return false;
  await index.upsert({
    id: `artifact:${artifact.entityMode}:${artifact.entityId}:${artifact.id}`,
    data: buildArtifactVectorText(artifact),
    metadata: {
      kind: "artifact",
      mode: artifact.entityMode,
      entityId: artifact.entityId,
      artifactId: artifact.id,
      title: artifact.title,
      subtitle: artifact.year ? `${artifact.year}` : artifact.type,
    } satisfies VectorMetadata,
  });
  return true;
}

export interface VectorHit {
  entityId: string;
  mode: F1EntityMode;
  kind: "entity" | "artifact";
  artifactId?: string;
  score: number;
  title: string;
  subtitle: string;
}

/**
 * Semantic heritage search. Returns ranked hits or null when vector is not
 * configured (so callers can fall back deterministically).
 */
export async function searchHeritage(
  query: string,
  mode: F1EntityMode | "all",
  topK = 12,
): Promise<VectorHit[] | null> {
  const index = getVectorIndex();
  if (!index) return null;
  try {
    const results = await index.query({
      data: query,
      topK,
      includeMetadata: true,
    });
    return results
      .map((r): VectorHit | null => {
        const meta = r.metadata as unknown as VectorMetadata | undefined;
        if (!meta) return null;
        if (mode !== "all" && meta.mode !== mode) return null;
        return {
          entityId: meta.entityId,
          mode: meta.mode,
          kind: meta.kind,
          artifactId: meta.artifactId,
          score: r.score,
          title: meta.title,
          subtitle: meta.subtitle,
        };
      })
      .filter((hit): hit is VectorHit => hit !== null);
  } catch {
    // Never surface provider errors; fall back to deterministic search.
    return null;
  }
}

/** Find entities semantically similar to a given entity. */
export async function findSimilarEntities(
  entity: HeritageEntity,
  topK = 6,
): Promise<VectorHit[] | null> {
  const index = getVectorIndex();
  if (!index) return null;
  try {
    const results = await index.query({
      data: buildEntityVectorText(entity),
      topK: topK + 1,
      includeMetadata: true,
    });
    return results
      .map((r): VectorHit | null => {
        const meta = r.metadata as unknown as VectorMetadata | undefined;
        if (!meta || meta.kind !== "entity") return null;
        if (meta.entityId === entity.id) return null;
        return {
          entityId: meta.entityId,
          mode: meta.mode,
          kind: meta.kind,
          score: r.score,
          title: meta.title,
          subtitle: meta.subtitle,
        };
      })
      .filter((hit): hit is VectorHit => hit !== null)
      .slice(0, topK);
  } catch {
    return null;
  }
}

export type { SearchResult };
