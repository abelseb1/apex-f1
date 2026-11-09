import { z } from "zod";
import type { Constructor, Driver, QualifyingResult, Race, Session, SessionType, Standing } from "./types";

type ProviderRecord = Record<string, unknown>;

function asRecord(value: unknown): ProviderRecord {
  return value && typeof value === "object" ? value as ProviderRecord : {};
}

const driverSchema = z.object({
  driverId: z.string().optional(),
  permanentNumber: z.string().optional(),
  code: z.string().optional(),
  givenName: z.string(),
  familyName: z.string(),
  nationality: z.string().default("Unknown"),
  dateOfBirth: z.string().optional()
});

const constructorSchema = z.object({
  constructorId: z.string(),
  name: z.string(),
  nationality: z.string().default("Unknown")
});

export function isRace(value: unknown): value is Race {
  return Boolean(value && typeof value === "object" && "raceName" in value && "circuit" in value);
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function combineDateTime(date?: string, time?: string): string | undefined {
  if (!date) return undefined;
  return `${date}T${time ?? "00:00:00Z"}`;
}

function sessionStatus(startsAt: string, type: SessionType, now = new Date()): Race["status"] {
  const start = new Date(startsAt).getTime();
  const durationMs = type === "Race" ? 3 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
  const current = now.getTime();

  if (Number.isNaN(start)) return "upcoming";
  if (current < start) return "upcoming";
  if (current <= start + durationMs) return "live";
  return "completed";
}

export function adaptJolpicaDriver(raw: unknown): Driver {
  const driver = driverSchema.parse(raw);
  return {
    id: driver.driverId ?? `${driver.givenName}_${driver.familyName}`.toLowerCase(),
    permanentNumber: driver.permanentNumber,
    code: driver.code ?? driver.familyName.slice(0, 3).toUpperCase(),
    givenName: driver.givenName,
    familyName: driver.familyName,
    nationality: driver.nationality,
    dateOfBirth: driver.dateOfBirth
  };
}

export function adaptJolpicaConstructor(raw: unknown): Constructor {
  const constructor = constructorSchema.parse(raw);
  return {
    id: constructor.constructorId,
    name: constructor.name,
    nationality: constructor.nationality,
    drivers: []
  };
}

export function adaptJolpicaRace(raw: unknown, fallbackSeason = new Date().getUTCFullYear(), now = new Date()): Race {
  const race = asRecord(raw);
  const circuit = asRecord(race.Circuit);
  const location = asRecord(circuit.Location);
  const raceName = String(race.raceName ?? "Grand Prix");
  const season = Number(race.season ?? fallbackSeason);
  const round = Number(race.round ?? 0);
  const raceId = `${season}-${round}`;
  const raceDate = combineDateTime(stringOrUndefined(race.date), stringOrUndefined(race.time)) ?? `${season}-01-01T00:00:00Z`;

  const sessions = adaptJolpicaSessions(race, raceId, now);
  const raceSessionStatus = sessionStatus(raceDate, "Race", now);

  return {
    id: raceId,
    season,
    round,
    raceName,
    grandPrix: raceName.replace(" Grand Prix", ""),
    raceDate,
    status: raceSessionStatus,
    circuit: {
      id: String(circuit.circuitId ?? `round-${round}`),
      name: String(circuit.circuitName ?? "Unknown circuit"),
      city: String(location.locality ?? "Unknown"),
      country: String(location.country ?? "Unknown"),
      latitude: Number(location.lat) || undefined,
      longitude: Number(location.long) || undefined
    },
    sessions,
    historicalWinners: []
  };
}

export function adaptJolpicaSessions(race: ProviderRecord, raceId: string, now = new Date()): Session[] {
  const mainRaceDate = combineDateTime(stringOrUndefined(race.date), stringOrUndefined(race.time));
  const sessionFields: Array<{ key: string; type: SessionType }> = [
    { key: "FirstPractice", type: "Practice 1" },
    { key: "SecondPractice", type: "Practice 2" },
    { key: "ThirdPractice", type: "Practice 3" },
    { key: "SprintQualifying", type: "Sprint Qualifying" },
    { key: "SprintShootout", type: "Sprint Qualifying" },
    { key: "Sprint", type: "Sprint" },
    { key: "Qualifying", type: "Qualifying" }
  ];

  const sessions = sessionFields.flatMap(({ key, type }) => {
    const session = asRecord(race[key]);
    const startsAt = combineDateTime(stringOrUndefined(session.date), stringOrUndefined(session.time));
    if (!startsAt) return [];

    return [{
      id: `${raceId}-${key.toLowerCase()}`,
      raceId,
      type,
      startsAt,
      status: sessionStatus(startsAt, type, now)
    }];
  });

  if (mainRaceDate) {
    sessions.push({
      id: `${raceId}-race`,
      raceId,
      type: "Race",
      startsAt: mainRaceDate,
      status: sessionStatus(mainRaceDate, "Race", now)
    });
  }

  return sessions.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export function adaptDriverStanding(raw: unknown): Standing {
  const row = asRecord(raw);
  const driver = adaptJolpicaDriver(row.Driver);
  return {
    position: Number(row.position),
    entityId: driver.id,
    name: `${driver.givenName} ${driver.familyName}`,
    points: Number(row.points ?? 0),
    wins: Number(row.wins ?? 0)
  };
}

export function adaptConstructorStanding(raw: unknown): Standing {
  const row = asRecord(raw);
  const constructor = adaptJolpicaConstructor(row.Constructor);
  return {
    position: Number(row.position),
    entityId: constructor.id,
    name: constructor.name,
    points: Number(row.points ?? 0),
    wins: Number(row.wins ?? 0)
  };
}

export function adaptQualifyingResult(raw: unknown): QualifyingResult {
  const row = asRecord(raw);
  const constructor = asRecord(row.Constructor);
  const driver = adaptJolpicaDriver(row.Driver);
  return {
    position: Number(row.position),
    driverId: driver.id,
    driverCode: driver.code,
    constructorName: String(constructor.name ?? "Unknown"),
    q1: typeof row.Q1 === "string" ? row.Q1 : undefined,
    q2: typeof row.Q2 === "string" ? row.Q2 : undefined,
    q3: typeof row.Q3 === "string" ? row.Q3 : undefined,
    gap: row.Q3 ? undefined : "No Q3 time",
    eliminatedIn: Number(row.position) <= 10 ? undefined : row.Q2 ? "Q2" : "Q1"
  };
}
