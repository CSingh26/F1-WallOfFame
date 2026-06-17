import { getAllArtifacts, getAllHydratedEntities } from "../lib/f1/repository";
import { getStatsSummary } from "../lib/f1/stats-aggregator";

const entities = getAllHydratedEntities();
const artifacts = getAllArtifacts();

console.log("F1 seed data ready", {
  ...getStatsSummary(),
  entities: entities.length,
  artifacts: artifacts.length,
});
