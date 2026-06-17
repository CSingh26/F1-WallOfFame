type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function cacheReadThrough<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
): Promise<T> {
  const existing = memoryCache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  const value = await loader();
  memoryCache.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

export function clearF1Cache() {
  memoryCache.clear();
}
