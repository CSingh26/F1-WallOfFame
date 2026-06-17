/**
 * Lightweight in-memory cache with TTL. Used to wrap external API calls so
 * pages never hammer Jolpica / OpenF1. In serverless this is per-instance and
 * best-effort; it degrades gracefully and never throws.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Wrap an async producer with caching. Errors are not cached. */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  producer: () => Promise<T>,
): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== undefined) return cached;
  const value = await producer();
  cacheSet(key, value, ttlMs);
  return value;
}

export function cacheClear(): void {
  store.clear();
}

export const TTL = {
  short: 60_000, // 1 min
  medium: 5 * 60_000, // 5 min
  long: 60 * 60_000, // 1 hour
} as const;
