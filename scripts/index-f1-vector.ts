/**
 * Indexes the seed entities + artifacts into Upstash Vector for semantic search.
 *
 * Gracefully skips (exit 0) when Upstash Vector is not configured, so it is
 * safe to run in CI or local environments without credentials. Search still
 * works via the deterministic local fallback when the index is empty.
 *
 * Usage: npm run index:vector
 */
import { isVectorConfigured } from "../lib/f1/env";
import { getAllEntitiesForIndexing } from "../lib/f1/repository";
import { indexEntity, indexArtifact } from "../lib/f1/vector";

async function main() {
  if (!isVectorConfigured()) {
    console.log(
      "Upstash Vector is not configured (UPSTASH_VECTOR_REST_URL / _TOKEN missing).",
    );
    console.log("Skipping vector indexing. Local search fallback remains active.");
    return;
  }

  const entities = getAllEntitiesForIndexing();
  let entityCount = 0;
  let artifactCount = 0;
  let failures = 0;

  for (const entity of entities) {
    const ok = await indexEntity(entity);
    if (ok) entityCount += 1;
    else failures += 1;

    for (const artifact of entity.artifacts) {
      const aok = await indexArtifact(artifact);
      if (aok) artifactCount += 1;
      else failures += 1;
    }
  }

  console.log("Vector indexing complete");
  console.log("========================");
  console.log(`Entities indexed:   ${entityCount}`);
  console.log(`Artifacts indexed:  ${artifactCount}`);
  console.log(`Failures:           ${failures}`);

  if (failures > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("Vector indexing failed:", err);
  process.exitCode = 1;
});
