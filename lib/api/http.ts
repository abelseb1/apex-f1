const cooldowns = new Map<string, number>();

export async function fetchJson(url: string, init: RequestInit = {}): Promise<unknown> {
  const origin = new URL(url).origin;
  const retryAt = cooldowns.get(origin) ?? 0;
  if (retryAt > Date.now()) throw new Error("Data provider rate limited (HTTP 429); retry delayed");
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: { Accept: "application/json", ...init.headers }
  });
  if (response.status === 429) {
    const retry = response.headers.get("Retry-After");
    const delay = Math.max(60_000, retry && Number.isFinite(Number(retry)) ? Number(retry) * 1000 : retry ? Date.parse(retry) - Date.now() || 60_000 : 60_000);
    cooldowns.set(origin, Date.now() + delay);
  }
  if (!response.ok) throw new Error(`Data provider returned HTTP ${response.status}`);
  return response.json();
}
