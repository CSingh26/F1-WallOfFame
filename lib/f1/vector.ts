import { getServerEnv, isVectorConfigured } from "./env";
import {
  getAllArtifacts,
  getAllHydratedEntities,
  getArtifact,
  getEntityByAnyId,
  searchEntities,
} from "./repository";
import type { F1Entity, F1EntityMode, HeritageArtifact, SearchResult } from "./types";
import { entitySubtitle, entityTitle } from "./utils";

export async function getVectorIndex() {
  if (!isVectorConfigured()) {
    return null;
  }

  const env = getServerEnv();
  const vectorModule = await import("@upstash/vector");
  const IndexCtor = vectorModule.Index as unknown as new (config: { url: string; token: string }) => {
    upsert: (payload: unknown) => Promise<unknown>;
    query: (payload: unknown) => Promise<unknown>;
  };

  return new IndexCtor({
    url: env.upstashVectorRestUrl,
    token: env.upstashVectorRestToken,
  });
}

export function buildEntityVectorText(entity: F1Entity) {
  const title = entityTitle(entity);
  const shared = [
    title,
    entity.mode,
    entity.nationality,
    entity.debutYear,
    entity.finalYear ?? "present",
    entity.active ? "active" : "historic",
    entity.championshipYears.join(" "),
  ];

  if (entity.mode === "driver") {
    return [
      ...shared,
      entity.primaryEra,
      entity.primaryTeam,
      entity.teams.join(" "),
      entity.bio30Words,
      entity.longBio,
    ].join(" ");
  }

  return [
    ...shared,
    entity.baseCountry,
    entity.totalConstructorsChampionships,
    entity.profile30Words,
    entity.longProfile,
  ].join(" ");
}

export function buildArtifactVectorText(artifact: HeritageArtifact) {
  return [
    artifact.title,
    artifact.type,
    artifact.year ?? "unknown year",
    artifact.description,
    artifact.importance,
    artifact.vectorText,
  ].join(" ");
}

export async function indexEntity(entity: F1Entity) {
  const index = await getVectorIndex();

  if (!index) {
    return { skipped: true, id: `${entity.mode}:${entity.id}` };
  }

  await index.upsert({
    id: `${entity.mode}:${entity.id}`,
    data: buildEntityVectorText(entity),
    metadata: {
      kind: "entity",
      entityId: entity.id,
      mode: entity.mode,
      title: entityTitle(entity),
    },
  });

  return { skipped: false, id: `${entity.mode}:${entity.id}` };
}

export async function indexArtifact(artifact: HeritageArtifact) {
  const index = await getVectorIndex();

  if (!index) {
    return { skipped: true, id: `artifact:${artifact.id}` };
  }

  await index.upsert({
    id: `artifact:${artifact.id}`,
    data: buildArtifactVectorText(artifact),
    metadata: {
      kind: "artifact",
      artifactId: artifact.id,
      entityId: artifact.entityId,
      mode: artifact.entityMode,
      title: artifact.title,
    },
  });

  return { skipped: false, id: `artifact:${artifact.id}` };
}

function vectorResultToSearchResult(result: unknown): SearchResult | null {
  const row = result as {
    id?: string;
    score?: number;
    metadata?: {
      kind?: string;
      entityId?: string;
      mode?: F1EntityMode;
      artifactId?: string;
    };
  };

  const entityId =
    row.metadata?.entityId ??
    (row.id?.startsWith("driver:") || row.id?.startsWith("team:")
      ? row.id.split(":").slice(1).join(":")
      : "");
  const mode = row.metadata?.mode;
  const entity = entityId ? getEntityByAnyId(entityId) : null;

  if (!entity || !mode) {
    return null;
  }

  const artifact = row.metadata?.artifactId ? getArtifact(row.metadata.artifactId) ?? undefined : undefined;

  return {
    id: `${mode}:${entity.id}:${row.id ?? "vector"}`,
    mode,
    title: entityTitle(entity),
    subtitle: entitySubtitle(entity),
    score: typeof row.score === "number" ? row.score : 0.75,
    reason: artifact ? `Vector matched ${artifact.title.toLowerCase()}` : "Semantic vector match",
    entity,
    artifact,
  };
}

export async function searchHeritage(query: string, mode: F1EntityMode | "all" = "all") {
  const index = await getVectorIndex();

  if (!index) {
    return {
      strategy: "local" as const,
      results: searchEntities(query, mode),
      note: "Vector search is not configured; showing deterministic local matches.",
    };
  }

  try {
    const vectorResults = (await index.query({
      data: query,
      topK: 10,
      includeMetadata: true,
    })) as unknown[];

    const results = vectorResults
      .map(vectorResultToSearchResult)
      .filter((result): result is SearchResult => Boolean(result))
      .filter((result) => mode === "all" || result.mode === mode);

    return {
      strategy: "vector" as const,
      results: results.length ? results : searchEntities(query, mode),
      note: results.length ? null : "Vector returned no archive match; local fallback supplied results.",
    };
  } catch {
    return {
      strategy: "local" as const,
      results: searchEntities(query, mode),
      note: "Vector search was unavailable; showing deterministic local matches.",
    };
  }
}

export function findSimilarEntities(entity: F1Entity, limit = 4) {
  const sourceText = buildEntityVectorText(entity).toLowerCase();
  return getAllHydratedEntities()
    .filter((candidate) => candidate.id !== entity.id)
    .map((candidate) => {
      const candidateText = buildEntityVectorText(candidate).toLowerCase();
      let score = candidate.mode === entity.mode ? 3 : 0;
      if (candidate.primaryColor === entity.primaryColor) score += 1;
      for (const year of entity.championshipYears) {
        if (candidate.championshipYears.some((candidateYear) => Math.abs(candidateYear - year) <= 2)) {
          score += 2;
        }
      }
      for (const term of sourceText.split(/\s+/).slice(0, 60)) {
        if (term.length > 5 && candidateText.includes(term)) score += 0.15;
      }
      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function vectorIndexableCounts() {
  return {
    entities: getAllHydratedEntities().length,
    artifacts: getAllArtifacts().length,
  };
}
