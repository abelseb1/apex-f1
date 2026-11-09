// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const response = (payload: unknown) => new Response(JSON.stringify(payload), { headers: { "Content-Type": "application/json" } });
const driver = { driverId: "lawson", code: "LAW", givenName: "Liam", familyName: "Lawson", nationality: "New Zealander" };
const constructor = { constructorId: "rb", name: "RB F1 Team", nationality: "Italian" };

beforeEach(() => vi.resetModules());
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("verified season data", () => {
  it("retrieves every page, including a race split across pages", async () => {
    const fetch = vi.fn(async (url: string) => {
      const offset = Number(new URL(url).searchParams.get("offset"));
      return response({ MRData: { total: "122", RaceTable: { Races: [{ round: offset ? "6" : "1", Results: Array.from({ length: offset ? 22 : 100 }, (_, i) => ({ position: String(i + 1), Driver: driver })) }] } } });
    });
    vi.stubGlobal("fetch", fetch);
    const { getSeasonResultRows } = await import("@/lib/api/jolpicaClient");
    const results = await getSeasonResultRows(2026);
    expect(results).toHaveLength(122);
    expect(results[121].round).toBe(6);
    expect(fetch.mock.calls.map(([url]) => new URL(url).searchParams.get("offset"))).toEqual(["0", "100"]);
  });

  it("returns no invented scores when a provider is down", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Unavailable", { status: 503 })));
    const api = await import("@/lib/api/jolpicaClient");
    expect(await api.getDriverStandings(2025)).toEqual([]);
    expect(await api.getCalendar(2025)).toEqual([]);
    expect(await api.getSeasonDataStatus(2025)).toMatchObject({ status: "unavailable", fetchedAt: null });
    expect(await api.getSeasonDataStatus(2026)).toMatchObject({ status: "stale", round: 20 });
  });

  it("preserves the timestamp and labels last-known standings after an outage", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn().mockResolvedValueOnce(response({ MRData: { StandingsTable: { StandingsLists: [{ round: "20", DriverStandings: [{ Driver: driver, position: "8", points: "42", wins: "0" }] }] } } })).mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", fetch);
    const api = await import("@/lib/api/jolpicaClient");
    const initial = await api.getSeasonDataStatus();
    vi.advanceTimersByTime(121_000);
    expect(await api.getSeasonDataStatus()).toMatchObject({ status: "stale", fetchedAt: initial.fetchedAt, round: 20 });
  });

  it("matches Racing Bulls to its local car and uses provider statistics", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => response(url.includes("constructorStandings")
      ? { MRData: { StandingsTable: { StandingsLists: [{ ConstructorStandings: [{ Constructor: constructor, points: "92", wins: "0" }] }] } } }
      : { MRData: { total: "1", RaceTable: { Races: [{ round: "20", Results: [{ Constructor: constructor, Driver: driver, position: "7", grid: "12" }] }] } } })));
    const { getConstructors } = await import("@/lib/api/jolpicaClient");
    expect((await getConstructors())[0]).toMatchObject({ id: "racing_bulls", points: 92, topTens: 1, racesEntered: 1, podiums: 0, carImageUrl: "/f1-assets/cars/racing_bulls.png" });
  });

  it("coalesces concurrent loads and allows retries after failure", async () => {
    const { cached } = await import("@/lib/api/cache");
    const load = vi.fn(async () => 42);
    expect(await Promise.all([cached("same", 1000, load), cached("same", 1000, load)])).toEqual([42, 42]);
    expect(load).toHaveBeenCalledTimes(1);
    await expect(cached("failed", 1000, async () => { throw new Error("fail"); })).rejects.toThrow();
    expect(await cached("failed", 1000, load)).toBe(42);
  });

  it("respects provider Retry-After before making another request", async () => {
    vi.useFakeTimers();
    const fetch = vi.fn().mockResolvedValueOnce(new Response("Rate limited", { status: 429, headers: { "Retry-After": "120" } })).mockResolvedValue(response({ ok: true }));
    vi.stubGlobal("fetch", fetch);
    const { fetchJson } = await import("@/lib/api/http");
    await expect(fetchJson("https://provider.example/first")).rejects.toThrow("HTTP 429");
    await expect(fetchJson("https://provider.example/second")).rejects.toThrow("retry delayed");
    expect(fetch).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(121_000);
    expect(await fetchJson("https://provider.example/second")).toEqual({ ok: true });
  });

  it("assigns the supplied portraits to the three named drivers", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Unavailable", { status: 503 })));
    const { getDrivers } = await import("@/lib/api/jolpicaClient");
    const drivers = await getDrivers(2026);
    for (const [id, image] of [["rafael_camara", "rafael_camara"], ["ryo_hirakawa", "ryo_hirakawa"], ["tsunoda", "yuki_tsunoda"]]) {
      expect(drivers.find(driver => driver.id === id)).toMatchObject({ headshotUrl: `/f1-assets/drivers/${image}-portrait.webp`, portraitStyle: "cutout" });
    }
    expect(drivers.find(driver => driver.id === "rafael_camara")).toMatchObject({ permanentNumber: "51", nationality: "Brazilian", dateOfBirth: "2005-05-05" });
  });

  it("labels saved timing as historical and preserves its capture time", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("Unavailable", { status: 503 })));
    const { getLiveTimingSnapshot } = await import("@/lib/api/openf1Client");
    const { default: saved } = await import("@/lib/api/verified-snapshot.json");
    const timing = await getLiveTimingSnapshot();
    expect(timing).toMatchObject({ status: "Historical", source: "OpenF1 saved snapshot", lastUpdated: saved.timing.lastUpdated });
    expect(timing.rows).toHaveLength(saved.timing.rows.length);
  });
});

describe.runIf(process.env.API_SMOKE === "1")("real provider smoke checks", () => {
  it("loads current standings, complete season results, calendar and timing", async () => {
    const api = await import("@/lib/api");
    const [standings, calendar, results, drivers, constructors, qualifying] = await Promise.all([
      api.getDriverStandings(), api.getCalendar(), api.getSeasonResultRows(2026), api.getDrivers(), api.getConstructors(), api.getQualifyingResults()
    ]);
    expect(standings.length).toBeGreaterThanOrEqual(22);
    expect(calendar.length).toBeGreaterThan(20);
    expect(results.length).toBeGreaterThan(400);
    expect(drivers.length).toBe(standings.length);
    expect(constructors).toHaveLength(11);
    expect(qualifying).toHaveLength(22);
    const snapshot = await api.getLiveTimingSnapshot();
    expect(snapshot.rows).toHaveLength(22);
    expect(snapshot.source).toBe("OpenF1");
    expect(snapshot.rows[0].lastLap).not.toBe("--");
    expect(snapshot.status).toBe("Historical");
    expect(Date.parse(snapshot.sessionDate ?? "")).toBeGreaterThan(Date.now() - 30 * 86_400_000);
    console.log(JSON.stringify({ season: await api.getSeasonDataStatus(), results: results.length, leader: standings[0], timing: { source: snapshot.source, session: snapshot.sessionName, date: snapshot.sessionDate, rows: snapshot.rows.length, lapRows: snapshot.rows.filter(r => r.bestLap !== "--").length } }));
  }, 120_000);
});
