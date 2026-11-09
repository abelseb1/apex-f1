type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

const store = new Map<string, CacheRecord<unknown>>();
const pending = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const existing = store.get(key) as CacheRecord<T> | undefined;
  if (existing && existing.expiresAt > Date.now()) {
    return existing.value;
  }

  const inFlight = pending.get(key) as Promise<T> | undefined;
  if (inFlight) return inFlight;
  const request = (async () => {
    const value = await load();
    const entry = { value, expiresAt: Date.now() + ttlMs };
    store.set(key, entry);
    return value;
  })().finally(() => pending.delete(key));
  pending.set(key, request);
  return request;
}

export const cacheTtl = {
  // Live timing changes quickly, so keep this deliberately short to avoid hammering OpenF1.
  live: 10_000,
  // Calendar and profile endpoints are effectively static during a race weekend.
  stable: 60 * 60 * 1000,
  standings: 2 * 60 * 1000,
  results: 5 * 60 * 1000,
  news: 5 * 60 * 1000
};
