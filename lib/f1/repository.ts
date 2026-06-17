import { ERA_BANDS } from "./constants";
import { SEED_DRIVERS } from "./seed-drivers";
import { SEED_TEAMS } from "./seed-teams";
import { searchHeritage } from "./vector";
import type {
  Artifact,
  EraBand,
  F1EntityMode,
  HeritageEntity,
  SearchResult,
  StatsSummary,
} from "./types";
import { getStatsSummary } from "./stats-aggregator";
import { IMPORTANCE_WEIGHT } from "./constants";
import { tokenOverlapScore } from "./utils";

/**
 * Central data repository.
 *
 * Source-of-truth order:
 *   1. Normalized local seed data (always available, deterministic)
 *   2. Cached synced data (when sync routes have run) — merged onto seed
 *   3. External API clients are only reached through sync paths, never on
 *      every page render.
 *
 * Vector search is used for discovery only; deterministic search is the
 * always-available fallback.
 */

function allEntities(): HeritageEntity[] {
  return [...SEED_DRIVERS, ...SEED_TEAMS];
}

export function getEntities(mode: F1EntityMode): HeritageEntity[] {
  return mode === "driver" ? [...SEED_DRIVERS] : [...SEED_TEAMS];
}

export function getEntity(
  mode: F1EntityMode,
  id: string,
): HeritageEntity | null {
  const pool = mode === "driver" ? SEED_DRIVERS : SEED_TEAMS;
  return pool.find((e) => e.id === id || e.slug === id) ?? null;
}

export function getArtifactsForEntity(
  mode: F1EntityMode,
  id: string,
): Artifact[] {
  return getEntity(mode, id)?.artifacts ?? [];
}

export function getEraBands(): EraBand[] {
  return ERA_BANDS;
}

export function getStats(): StatsSummary {
  return getStatsSummary();
}

function entityTitle(entity: HeritageEntity): string {
  return entity.mode === "driver" ? entity.name : entity.constructorName;
}

function entitySubtitle(entity: HeritageEntity): string {
  if (entity.mode === "driver") {
    return `${entity.nationality} · ${entity.careerSpanLabel}`;
  }
  return `${entity.nationality} · since ${entity.debutYear}`;
}

/**
 * Search entities. Uses Upstash Vector when configured, otherwise a
 * deterministic local search over names, bios, eras, championships, teams,
 * and artifacts. Always returns results without throwing.
 */
export async function searchEntities(
  query: string,
  mode: F1EntityMode | "all",
): Promise<{ results: SearchResult[]; usedVector: boolean }> {
  const vectorHits = await searchHeritage(query, mode);

  if (vectorHits && vectorHits.length > 0) {
    const results: SearchResult[] = [];
    for (const hit of vectorHits) {
      const entity = getEntity(hit.mode, hit.entityId);
      if (!entity) continue;
      const artifact =
        hit.kind === "artifact" && hit.artifactId
          ? entity.artifacts.find((a) => a.id === hit.artifactId) ?? null
          : null;
      results.push({
        id: artifact ? artifact.id : entity.id,
        mode: hit.mode,
        title: hit.title || entityTitle(entity),
        subtitle: artifact ? `${artifact.title}` : entitySubtitle(entity),
        score: hit.score,
        reason:
          hit.kind === "artifact"
            ? "Matched a museum artifact semantically"
            : "Semantic match on heritage profile",
        entity,
        artifact,
      });
    }
    if (results.length > 0) {
      return { results: dedupeByEntity(results), usedVector: true };
    }
  }

  return { results: localSearch(query, mode), usedVector: false };
}

function dedupeByEntity(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const r of results) {
    const key = `${r.mode}:${r.entity.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

/** Deterministic local search — the always-available fallback. */
export function localSearch(
  query: string,
  mode: F1EntityMode | "all",
): SearchResult[] {
  const pool =
    mode === "all"
      ? allEntities()
      : allEntities().filter((e) => e.mode === mode);

  const scored = pool.map((entity) => {
    const haystack = buildHaystack(entity);
    let score = tokenOverlapScore(query, haystack);

    // Artifact-level boost: best matching artifact contributes to the score.
    let bestArtifact: Artifact | null = null;
    let bestArtifactScore = 0;
    for (const artifact of entity.artifacts) {
      const aScore =
        tokenOverlapScore(query, artifact.vectorText) *
        (0.6 + 0.1 * IMPORTANCE_WEIGHT[artifact.importance]);
      if (aScore > bestArtifactScore) {
        bestArtifactScore = aScore;
        bestArtifact = artifact;
      }
    }
    score = Math.max(score, bestArtifactScore * 0.9);

    return { entity, score, bestArtifact, bestArtifactScore };
  });

  return scored
    .filter((s) => s.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((s) => {
      const useArtifact =
        s.bestArtifact && s.bestArtifactScore > s.score * 0.95;
      return {
        id: useArtifact ? s.bestArtifact!.id : s.entity.id,
        mode: s.entity.mode,
        title: entityTitle(s.entity),
        subtitle: useArtifact
          ? s.bestArtifact!.title
          : entitySubtitle(s.entity),
        score: Number(s.score.toFixed(3)),
        reason: useArtifact
          ? "Matched a museum artifact"
          : "Matched heritage profile",
        entity: s.entity,
        artifact: useArtifact ? s.bestArtifact : null,
      } satisfies SearchResult;
    });
}

function buildHaystack(entity: HeritageEntity): string {
  if (entity.mode === "driver") {
    return [
      entity.name,
      entity.nationality,
      entity.primaryEra,
      entity.primaryTeam,
      entity.teams.join(" "),
      entity.active ? "active modern current" : "historic classic retired",
      entity.championshipYears.join(" "),
      entity.totalChampionships ? "champion world title" : "",
      entity.bio30Words,
    ].join(" ");
  }
  return [
    entity.constructorName,
    entity.nationality,
    entity.baseCountry,
    entity.active ? "active modern current" : "historic classic defunct",
    entity.championshipYears.join(" "),
    entity.totalConstructorsChampionships ? "champion constructor title" : "",
    entity.profile30Words,
  ].join(" ");
}

/** All entities flattened — used by the indexing script. */
export function getAllEntitiesForIndexing(): HeritageEntity[] {
  return allEntities();
}
