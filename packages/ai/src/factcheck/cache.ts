interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key) as CacheEntry<T> | undefined;
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return hit.value;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  if (store.size > 500) {
    const first = store.keys().next().value;
    if (first) store.delete(first);
  }
}

export function ttlForTopic(topic: string): number {
  const short = ["POLITICS", "ELECTIONS", "SPORTS", "GOVERNANCE", "FINANCE", "CRIME"];
  if (short.includes(topic)) return 30 * 60 * 1000;
  if (["SCIENCE", "LEGAL", "COURTS"].includes(topic)) return 12 * 60 * 60 * 1000;
  return 6 * 60 * 60 * 1000;
}

export function normalizeClaimKey(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}
