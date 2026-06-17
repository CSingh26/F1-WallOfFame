import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { F1Entity, F1EntityMode, HydratedF1Entity, NullableStat } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function entityTitle(entity: F1Entity | HydratedF1Entity) {
  return entity.mode === "driver" ? entity.name : entity.constructorName;
}

export function entitySubtitle(entity: F1Entity | HydratedF1Entity) {
  if (entity.mode === "driver") {
    return `${entity.nationality} • ${entity.careerSpanLabel}`;
  }

  return `${entity.baseCountry} • ${entity.active ? "Active constructor" : "Historic constructor"}`;
}

export function formatStat(value: NullableStat, fallback = "Sync pending") {
  return typeof value === "number" ? value.toLocaleString("en-US") : fallback;
}

export function normalizeMode(value: string | null): F1EntityMode | null {
  return value === "driver" || value === "team" ? value : null;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function yearsLabel(debutYear: number, finalYear: number | null, active: boolean) {
  return `${debutYear}-${active ? "present" : finalYear ?? "syncing"}`;
}

export function includesText(source: string, query: string) {
  return source.toLowerCase().includes(query.toLowerCase());
}

export function safeJsonError(code: string, message: string, status = 400, details?: unknown) {
  return Response.json({ error: { code, message, details } }, { status });
}
