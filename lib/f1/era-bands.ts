import { ERA_BANDS, eraForYear } from "./constants";
import type { EraBand, EraId } from "./types";

export { ERA_BANDS, eraForYear };

export function getEraBands(): EraBand[] {
  return ERA_BANDS;
}

export function getEraBand(id: EraId): EraBand | undefined {
  return ERA_BANDS.find((band) => band.id === id);
}

export function eraLabel(id: EraId): string {
  return getEraBand(id)?.label ?? id;
}
