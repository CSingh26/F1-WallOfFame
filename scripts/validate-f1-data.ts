import { eraBands } from "../lib/f1/era-bands";
import { approvedImageManifest } from "../lib/f1/approved-image-manifest";
import { getAllArtifacts, getAllHydratedEntities } from "../lib/f1/repository";

function fail(message: string) {
  throw new Error(message);
}

function assertUnique(values: string[], label: string) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      fail(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

const entities = getAllHydratedEntities();
const artifacts = getAllArtifacts();

assertUnique(
  entities.map((entity) => `${entity.mode}:${entity.id}`),
  "entity id",
);
assertUnique(
  entities.map((entity) => `${entity.mode}:${entity.slug}`),
  "entity slug",
);
assertUnique(
  artifacts.map((artifact) => artifact.id),
  "artifact id",
);
assertUnique(
  eraBands.map((band) => band.id),
  "era band id",
);

for (const entity of entities) {
  if (!entity.image.alt || !entity.image.source || !entity.image.licenseStatus) {
    fail(`Image metadata incomplete for ${entity.mode}:${entity.id}`);
  }

  if (entity.artifacts.length < 3) {
    fail(`Expected at least three artifacts for ${entity.mode}:${entity.id}`);
  }

  for (const year of entity.championshipYears) {
    if (year < 1950 || year > new Date().getFullYear()) {
      fail(`Championship year out of range for ${entity.mode}:${entity.id}: ${year}`);
    }
  }
}

for (const band of eraBands) {
  if (band.startYear > band.endYear) {
    fail(`Era band has invalid range: ${band.id}`);
  }
}

for (const asset of approvedImageManifest) {
  if (asset.licenseStatus !== "approved") {
    fail(`Manifest asset must be approved before serving: ${asset.id}`);
  }
}

console.log("F1 seed validation passed", {
  entities: entities.length,
  artifacts: artifacts.length,
  eraBands: eraBands.length,
  approvedImages: approvedImageManifest.length,
});
