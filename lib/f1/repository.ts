import { CURRENT_F1_YEAR } from "./constants";
import { getServerEnv, isVectorConfigured } from "./env";
import { eraBands } from "./era-bands";
import { artifactById, getSeedArtifactsForEntity, seedArtifacts } from "./seed-artifacts";
import { seedDrivers } from "./seed-drivers";
import { seedTeams } from "./seed-teams";
import { getStatsSummary } from "./stats-aggregator";
import type {
  F1DriverEntity,
  F1Entity,
  F1EntityMode,
  F1TeamEntity,
  HeritageArtifact,
  HydratedF1Entity,
  ProviderHealth,
  SearchResult,
} from "./types";
import { entitySubtitle, entityTitle } from "./utils";

const allEntities: F1Entity[] = [...seedDrivers, ...seedTeams];

export function hydrateEntity<T extends F1Entity>(entity: T): HydratedF1Entity<T> {
  return {
    ...entity,
    artifacts: getSeedArtifactsForEntity(entity),
  };
}

export function getEntities(mode: "driver"): HydratedF1Entity<F1DriverEntity>[];
export function getEntities(mode: "team"): HydratedF1Entity<F1TeamEntity>[];
export function getEntities(mode: F1EntityMode): HydratedF1Entity[];
export function getEntities(mode: F1EntityMode): HydratedF1Entity[] {
  return allEntities
    .filter((entity) => entity.mode === mode)
    .sort((a, b) => a.debutYear - b.debutYear || entityTitle(a).localeCompare(entityTitle(b)))
    .map((entity) => hydrateEntity(entity));
}

export function getEntity(mode: F1EntityMode, id: string) {
  const entity = allEntities.find((candidate) => candidate.mode === mode && candidate.id === id);
  return entity ? hydrateEntity(entity) : null;
}

export function getEntityByAnyId(id: string) {
  const entity = allEntities.find((candidate) => candidate.id === id || candidate.slug === id);
  return entity ? hydrateEntity(entity) : null;
}

export function getArtifactsForEntity(mode: F1EntityMode, id: string): HeritageArtifact[] {
  const entity = getEntity(mode, id);
  return entity?.artifacts ?? [];
}

export function getEraBands() {
  return eraBands;
}

export { getStatsSummary };

function haystack(entity: HydratedF1Entity) {
  const title = entityTitle(entity);
  const profile =
    entity.mode === "driver"
      ? `${entity.bio30Words} ${entity.longBio} ${entity.teams.join(" ")} ${entity.primaryEra} ${entity.primaryTeam}`
      : `${entity.profile30Words} ${entity.longProfile} ${entity.baseCountry}`;

  return [
    title,
    entity.nationality,
    entity.debutYear,
    entity.finalYear ?? CURRENT_F1_YEAR,
    entity.championshipYears.join(" "),
    profile,
    ...entity.artifacts.map((artifact) => `${artifact.title} ${artifact.description} ${artifact.vectorText}`),
  ]
    .join(" ")
    .toLowerCase();
}

function scoreEntity(entity: HydratedF1Entity, query: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (!terms.length) {
    return { score: 0, artifact: undefined };
  }

  const text = haystack(entity);
  const title = entityTitle(entity).toLowerCase();
  const artifactHit = entity.artifacts.find((artifact) =>
    terms.some((term) => `${artifact.title} ${artifact.description} ${artifact.vectorText}`.toLowerCase().includes(term)),
  );

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 7;
    if (text.includes(term)) score += 2;
    if (entity.championshipYears.some((year) => String(year) === term)) score += 3;
  }

  if (query.toLowerCase().includes("champion") && entity.championshipYears.length) score += 4;
  if (query.toLowerCase().includes("british") && entity.nationality.toLowerCase().includes("british")) score += 4;
  if (query.toLowerCase().includes("turbo") && text.includes("turbo")) score += 4;
  if (query.toLowerCase().includes("schumacher era") && text.includes("schumacher era")) score += 6;
  if (query.toLowerCase().includes("ground-effect") && text.includes("ground-effect")) score += 6;

  return {
    score,
    artifact: artifactHit,
  };
}

export function searchEntities(query: string, mode: F1EntityMode | "all" = "all"): SearchResult[] {
  const targetEntities = allEntities
    .filter((entity) => mode === "all" || entity.mode === mode)
    .map((entity) => hydrateEntity(entity));

  return targetEntities
    .map((entity) => {
      const scored = scoreEntity(entity, query);
      return {
        id: `${entity.mode}:${entity.id}`,
        mode: entity.mode,
        title: entityTitle(entity),
        subtitle: entitySubtitle(entity),
        score: scored.score,
        reason:
          scored.score > 0
            ? scored.artifact
              ? `Matched ${scored.artifact.title.toLowerCase()} and archive profile`
              : "Matched archive profile and championship metadata"
            : "Low-confidence local archive match",
        entity,
        artifact: scored.artifact,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 10);
}

export function getArtifact(id: string) {
  return artifactById.get(id) ?? null;
}

export function getAllArtifacts() {
  return seedArtifacts;
}

export function getAllHydratedEntities() {
  return allEntities.map((entity) => hydrateEntity(entity));
}

export function getProviderHealth(): ProviderHealth {
  const env = getServerEnv();

  return {
    seed: "ready",
    jolpicaConfigured: Boolean(env.jolpicaBaseUrl),
    openF1Configured: Boolean(env.openF1BaseUrl),
    vectorConfigured: isVectorConfigured(),
    appUrlPresent: Boolean(env.appUrl),
  };
}
