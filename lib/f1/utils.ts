import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The current F1 season year (the timeline upper bound). */
export function getCurrentSeasonYear(): number {
  return new Date().getFullYear();
}

export function careerSpanLabel(
  debutYear: number,
  finalYear: number | null,
): string {
  if (finalYear === null) return `${debutYear}–present`;
  if (finalYear === debutYear) return `${debutYear}`;
  return `${debutYear}–${finalYear}`;
}

export function formatStat(value: number | null): string {
  if (value === null || value === undefined) return "Data syncing";
  return new Intl.NumberFormat("en-US").format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Deterministic 0..1 hash from a string — used for stable visual jitter. */
export function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // map to 0..1
  return ((h >>> 0) % 100000) / 100000;
}

export function uniqueBy<T, K>(items: T[], key: (item: T) => K): T[] {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(item);
    }
  }
  return out;
}

/** Simple text similarity for deterministic fallback search (0..1). */
export function tokenOverlapScore(query: string, target: string): number {
  const q = tokenize(query);
  if (q.length === 0) return 0;
  const t = new Set(tokenize(target));
  let hits = 0;
  for (const token of q) {
    if (t.has(token)) hits += 1;
    else {
      // partial credit for prefix matches
      for (const tt of t) {
        if (tt.startsWith(token) || token.startsWith(tt)) {
          hits += 0.5;
          break;
        }
      }
    }
  }
  return clamp(hits / q.length, 0, 1);
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}
