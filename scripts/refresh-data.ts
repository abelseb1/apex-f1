import { writeFile } from "node:fs/promises";
import { getLiveTimingSnapshot } from "../lib/api/openf1Client";

const year = new Date().getUTCFullYear();
const jolpica: Record<string, { payload: unknown; fetchedAt: string }> = {};
async function collect(path: string) {
  await new Promise(resolve => setTimeout(resolve, 1100));
  const response = await fetch(`https://api.jolpi.ca/ergast/f1${path}`, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Snapshot stopped: HTTP ${response.status}`);
  const json = await response.json();
  if (!json.MRData) throw new Error("Snapshot stopped: invalid provider data");
  jolpica[path] = { payload: json.MRData, fetchedAt: new Date().toISOString() };
  return json.MRData;
}
await collect(`/${year}.json?limit=100`);
await collect(`/${year}/driverStandings.json?limit=100`);
await collect(`/${year}/constructorStandings.json?limit=100`);
await collect(`/${year}/last/qualifying.json?limit=100`);
let total = 1;
for (let offset = 0; offset < total; offset += 100) {
  const data = await collect(`/${year}/results.json?limit=100&offset=${offset}`);
  total = Number(data.total);
  if (!Number.isFinite(total) || total > 3000) throw new Error("Invalid result count");
}
const timing = await getLiveTimingSnapshot();
if (timing.source !== "OpenF1" || timing.status !== "Historical" || !timing.rows.length) throw new Error("Snapshot stopped: a verified completed session is required");
await writeFile(new URL("../lib/api/verified-snapshot.json", import.meta.url), JSON.stringify({ jolpica, timing }));
console.log(JSON.stringify({ season: year, results: total, timingRows: timing.rows.length, capturedAt: timing.lastUpdated }));
