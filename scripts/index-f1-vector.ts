import { getAllArtifacts, getAllHydratedEntities } from "../lib/f1/repository";
import { getVectorIndex, indexArtifact, indexEntity, vectorIndexableCounts } from "../lib/f1/vector";

async function main() {
  const index = await getVectorIndex();
  const counts = vectorIndexableCounts();

  if (!index) {
    console.log("Upstash Vector is not configured; skipping indexing.", counts);
    return;
  }

  let indexedEntities = 0;
  let indexedArtifacts = 0;

  for (const entity of getAllHydratedEntities()) {
    const result = await indexEntity(entity);
    if (!result.skipped) indexedEntities += 1;
  }

  for (const artifact of getAllArtifacts()) {
    const result = await indexArtifact(artifact);
    if (!result.skipped) indexedArtifacts += 1;
  }

  console.log("Upstash Vector indexing complete", {
    indexedEntities,
    indexedArtifacts,
    plannedEntities: counts.entities,
    plannedArtifacts: counts.artifacts,
  });
}

main().catch((error) => {
  console.error("Vector indexing failed", {
    message: error instanceof Error ? error.message : "Unknown error",
  });
  process.exitCode = 1;
});
