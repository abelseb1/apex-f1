import { cached, cacheTtl } from "./cache";
import { fetchJson } from "./http";
import verifiedSnapshot from "./verified-snapshot.json";
import { mockConstructors, mockDrivers } from "./mockData";
import { adaptConstructorStanding, adaptDriverStanding, adaptJolpicaConstructor, adaptJolpicaDriver, adaptJolpicaRace, adaptQualifyingResult } from "./adapters";
import type { Constructor, Driver, QualifyingResult, Race, Standing } from "./types";

const baseUrl = process.env.JOLPICA_BASE_URL ?? "https://api.jolpi.ca/ergast/f1";
type Row = Record<string, unknown>;
const record = (value: unknown): Row => value && typeof value === "object" ? value as Row : {};
const rows = (value: unknown): Row[] => Array.isArray(value) ? value.map(record) : [];
const teamId = (id: unknown) => String(id) === "rb" ? "racing_bulls" : String(id);
type Data = { payload: Row; fetchedAt: string; stale: boolean };
const lastGood = new Map<string, Data>();
const savedData = verifiedSnapshot.jolpica as Record<string, { payload: Row; fetchedAt: string }>;
const extraPortraits: Record<string, string> = {
  camara: "/f1-assets/drivers/rafael_camara-portrait.webp",
  hirakawa: "/f1-assets/drivers/ryo_hirakawa-portrait.webp",
  tsunoda: "/f1-assets/drivers/yuki_tsunoda-portrait.webp"
};

async function getData(path: string, ttl = cacheTtl.standings): Promise<Data> {
  return cached(`jolpica:${path}`, ttl, async () => {
    try {
      const payload = record(await fetchJson(`${baseUrl}${path}`));
      if (!payload.MRData) throw new Error("Invalid Jolpica response");
      const data = { payload: record(payload.MRData), fetchedAt: new Date().toISOString(), stale: false };
      lastGood.set(path, data);
      return data;
    } catch (error) {
      const previous = lastGood.get(path);
      if (previous && Date.now() - Date.parse(previous.fetchedAt) < 86_400_000) return { ...previous, stale: true };
      const saved = savedData[path];
      if (saved) return { ...saved, stale: true };
      throw error;
    }
  });
}

async function standingData(year: number, kind: "Driver" | "Constructor") {
  const data = await getData(`/${year}/${kind.toLowerCase()}Standings.json?limit=100`);
  const table = record(data.payload.StandingsTable);
  const list = rows(table.StandingsLists)[0] ?? {};
  return { ...data, round: Number(list.round ?? 0), rows: rows(list[`${kind}Standings`]) };
}

export async function getSeasonDataStatus(year = new Date().getUTCFullYear()) {
  try {
    const data = await standingData(year, "Driver");
    return { source: "Jolpica", season: year, round: data.round, fetchedAt: data.fetchedAt, status: data.stale ? "stale" : data.rows.length ? "ok" : "pending" };
  } catch {
    return { source: "Jolpica", season: year, round: null, fetchedAt: null, status: "unavailable" };
  }
}

export async function getSeasonResultRows(year: number): Promise<Row[]> {
  return cached(`season-results:${year}`, cacheTtl.results, async () => {
    const results: Row[] = [];
    let total = 1;
    // Jolpica caps pages at 100 individual results, including split races.
    for (let offset = 0; offset < total; offset += 100) {
      const { payload } = await getData(`/${year}/results.json?limit=100&offset=${offset}`, cacheTtl.results);
      total = Number(payload.total);
      if (!Number.isFinite(total) || total > 3000) throw new Error("Invalid result count");
      const page = rows(record(payload.RaceTable).Races).flatMap((race) => rows(race.Results).map((result) => ({ ...result, round: Number(race.round) })));
      if (!page.length && offset < total) throw new Error("Incomplete season results");
      results.push(...page);
    }
    if (results.length !== total) throw new Error("Incomplete season results");
    return results;
  });
}

export async function getCurrentSeason() { return new Date().getUTCFullYear(); }

export async function getCalendar(year = new Date().getUTCFullYear()): Promise<Race[]> {
  try {
    const { payload } = await getData(`/${year}.json?limit=100`, cacheTtl.stable);
    return rows(record(payload.RaceTable).Races).map((race) => adaptJolpicaRace(race, year));
  } catch { return []; }
}

export async function getDriverStandings(year = new Date().getUTCFullYear()): Promise<Standing[]> {
  try { return (await standingData(year, "Driver")).rows.map(adaptDriverStanding); }
  catch { return []; }
}

export async function getConstructorStandings(year = new Date().getUTCFullYear()): Promise<Standing[]> {
  try { return (await standingData(year, "Constructor")).rows.map(adaptConstructorStanding); }
  catch { return []; }
}

export async function getDrivers(year = new Date().getUTCFullYear()): Promise<Driver[]> {
  const [standings, results] = await Promise.all([
    standingData(year, "Driver").catch(() => undefined), getSeasonResultRows(year).catch(() => undefined)
  ]);
  if (!standings) return [];
  return standings.rows.map((standing) => {
    const driver = adaptJolpicaDriver(standing.Driver);
    const profile = mockDrivers.find((item) => item.code === driver.code);
    const portrait = extraPortraits[driver.familyName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()];
    const teams = rows(standing.Constructors);
    const team = teams[teams.length - 1];
    const resultRows = results?.filter((r) => record(r.Driver).driverId === driver.id);
    return {
      ...driver,
      ...(driver.id === "rafael_camara" && year === 2026 ? {
        familyName: "C\u00e2mara",
        permanentNumber: driver.permanentNumber ?? "51",
        nationality: driver.nationality === "Unknown" ? "Brazilian" : driver.nationality,
        dateOfBirth: driver.dateOfBirth ?? "2005-05-05"
      } : {}),
      id: profile?.id ?? driver.id,
      headshotUrl: year === 2026 ? portrait ?? profile?.headshotUrl : undefined,
      portraitStyle: portrait && year === 2026 ? "cutout" as const : undefined,
      constructorId: team ? teamId(team.constructorId) : undefined,
      constructorName: team ? String(team.name) : undefined,
      points: Number(standing.points), wins: Number(standing.wins),
      podiums: resultRows?.filter((r) => Number(r.position) > 0 && Number(r.position) <= 3).length,
      poles: resultRows?.filter((r) => Number(r.grid) === 1).length,
      fastestLaps: resultRows?.filter((r) => Number(record(r.FastestLap).rank) === 1).length,
      recentResults: resultRows?.slice(-3).map((r) => String(r.positionText ?? r.position))
    };
  });
}

export async function getConstructors(year = new Date().getUTCFullYear()): Promise<Constructor[]> {
  const [standings, results] = await Promise.all([
    standingData(year, "Constructor").catch(() => undefined), getSeasonResultRows(year).catch(() => undefined)
  ]);
  if (!standings) return [];
  return standings.rows.map((standing) => {
    const team = adaptJolpicaConstructor(standing.Constructor);
    const id = teamId(team.id);
    const profile = mockConstructors.find((item) => item.id === id);
    const resultRows = results?.filter((r) => teamId(record(r.Constructor).constructorId) === id);
    return {
      ...team, id, carImageUrl: year === 2026 ? profile?.carImageUrl : undefined,
      points: Number(standing.points), wins: Number(standing.wins),
      podiums: resultRows?.filter((r) => Number(r.position) > 0 && Number(r.position) <= 3).length,
      poles: resultRows?.filter((r) => Number(r.grid) === 1).length,
      fastestLaps: resultRows?.filter((r) => Number(record(r.FastestLap).rank) === 1).length,
      racesEntered: resultRows ? new Set(resultRows.map((r) => r.round)).size : undefined,
      topTens: resultRows?.filter((r) => Number(r.position) > 0 && Number(r.position) <= 10).length,
      recentForm: resultRows?.slice(-2).map((r) => `P${r.position}`)
    };
  });
}

export async function getQualifyingResults(year = new Date().getUTCFullYear(), round = "last"): Promise<QualifyingResult[]> {
  if (!/^(last|[1-9]\d?)$/.test(round)) return [];
  try {
    const { payload } = await getData(`/${year}/${round}/qualifying.json?limit=100`, cacheTtl.results);
    const race = rows(record(payload.RaceTable).Races)[0];
    return rows(race?.QualifyingResults).map(adaptQualifyingResult);
  } catch { return []; }
}
