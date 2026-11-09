import { cached, cacheTtl } from "./cache";
import { fetchJson } from "./http";
import verifiedSnapshot from "./verified-snapshot.json";
import type { LiveTimingSnapshot } from "./types";

const baseUrl = process.env.OPENF1_BASE_URL ?? "https://api.openf1.org/v1";
const authUrl = process.env.OPENF1_AUTH_URL ?? `${new URL(baseUrl).origin}/token`;
const jolpicaBaseUrl = process.env.JOLPICA_BASE_URL ?? "https://api.jolpi.ca/ergast/f1";
const endpointBatchDelayMs = 1100;
const maxRequestsPerBatch = 2;
const teamColours: Record<string, string> = {
  "Alpine": "#0093cc",
  "Aston Martin": "#006f62",
  "Audi": "#c4c4c4",
  "Cadillac": "#8a8f94",
  "Ferrari": "#e80020",
  "Haas F1 Team": "#b6babd",
  "Haas": "#b6babd",
  "McLaren": "#ff8000",
  "Mercedes": "#00d2be",
  "RB F1 Team": "#6692ff",
  "Racing Bulls": "#6692ff",
  "Red Bull": "#3671c6",
  "Red Bull Racing": "#3671c6",
  "Williams": "#64c4ff"
};

type ProviderRecord = Record<string, unknown>;
type SessionStatus = LiveTimingSnapshot["status"];

interface DriverInfo {
  code: string;
  name: string;
  teamName: string;
  teamColour?: string;
}

let generatedToken: { value: string; expiresAt: number } | undefined;

function record(value: unknown): ProviderRecord {
  return value && typeof value === "object" ? value as ProviderRecord : {};
}

function rows(value: unknown): ProviderRecord[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

async function getOpenF1AccessToken(): Promise<string | undefined> {
  const configuredToken = stringValue(process.env.OPENF1_ACCESS_TOKEN);
  if (configuredToken) return configuredToken;

  const username = stringValue(process.env.OPENF1_USERNAME);
  const password = stringValue(process.env.OPENF1_PASSWORD);
  if (!username || !password) return undefined;

  if (generatedToken && generatedToken.expiresAt > Date.now() + 60_000) {
    return generatedToken.value;
  }

  const response = await fetch(authUrl, {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
    body: new URLSearchParams({ username, password })
  });

  if (!response.ok) {
    throw new Error(`OpenF1 authentication failed: ${response.status}`);
  }

  const payload = record(await response.json());
  const token = stringValue(payload.access_token);
  if (!token) throw new Error("OpenF1 authentication did not return an access token.");

  const expiresIn = numberValue(payload.expires_in) ?? 3600;
  generatedToken = { value: token, expiresAt: Date.now() + expiresIn * 1000 };
  return token;
}

function driverNumber(row: ProviderRecord): number | undefined {
  return numberValue(row.driver_number);
}

function timestamp(row: ProviderRecord): number {
  const raw = row.date ?? row.date_start ?? row.date_end;
  const parsed = stringValue(raw) ? Date.parse(String(raw)) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(path: string): Promise<unknown> {
  const token = await getOpenF1AccessToken();
  return fetchJson(`${baseUrl}${path}`, {
    headers: {
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });
}

async function getJolpicaJson(path: string): Promise<unknown> {
  return cached(`classification:${path}`, cacheTtl.results, () => fetchJson(`${jolpicaBaseUrl}${path}`));
}

async function getJsonBatch(paths: string[]): Promise<unknown[]> {
  const results: unknown[] = [];

  for (let index = 0; index < paths.length; index += maxRequestsPerBatch) {
    const batch = paths.slice(index, index + maxRequestsPerBatch);
    results.push(...await Promise.all(batch.map((path) => getJson(path).catch((error) => {
      if (/^\/(laps|stints|pit|race_control|intervals)\?/.test(path)) return [];
      throw error;
    }))));

    if (index + maxRequestsPerBatch < paths.length) {
      await sleep(endpointBatchDelayMs);
    }
  }

  return results;
}

function latestByDriver(sourceRows: ProviderRecord[], score: (row: ProviderRecord) => number = timestamp): Map<number, ProviderRecord> {
  const latest = new Map<number, ProviderRecord>();
  const scores = new Map<number, number>();

  for (const row of sourceRows) {
    const driver = driverNumber(row);
    if (driver === undefined) continue;

    const rowScore = score(row);
    const existingScore = scores.get(driver) ?? Number.NEGATIVE_INFINITY;
    if (!latest.has(driver) || rowScore >= existingScore) {
      latest.set(driver, row);
      scores.set(driver, rowScore);
    }
  }

  return latest;
}

function bestLapByDriver(lapRows: ProviderRecord[]): Map<number, ProviderRecord> {
  const best = new Map<number, ProviderRecord>();
  const durations = new Map<number, number>();

  for (const lap of lapRows) {
    const driver = driverNumber(lap);
    const duration = numberValue(lap.lap_duration);
    if (driver === undefined || duration === undefined || duration <= 0) continue;

    const existingDuration = durations.get(driver) ?? Number.POSITIVE_INFINITY;
    if (duration < existingDuration) {
      best.set(driver, lap);
      durations.set(driver, duration);
    }
  }

  return best;
}

function teamColour(value: unknown): string | undefined {
  const colour = stringValue(value);
  if (!colour) return undefined;

  const hex = colour.startsWith("#") ? colour.slice(1) : colour;
  return /^[0-9a-f]{6}$/i.test(hex) ? `#${hex}` : undefined;
}

function driverInfoMap(driverRows: ProviderRecord[]): Map<number, DriverInfo> {
  const info = new Map<number, DriverInfo>();

  for (const driverRow of driverRows) {
    const driver = driverNumber(driverRow);
    if (driver === undefined) continue;

    const code = stringValue(driverRow.name_acronym) ?? String(driver);
    const broadcastName = stringValue(driverRow.broadcast_name);
    const fullName = stringValue(driverRow.full_name);
    const composedName = [stringValue(driverRow.first_name), stringValue(driverRow.last_name)].filter(Boolean).join(" ");

    info.set(driver, {
      code,
      name: fullName ?? broadcastName ?? composedName ?? code,
      teamName: stringValue(driverRow.team_name) ?? "OpenF1",
      teamColour: teamColour(driverRow.team_colour)
    });
  }

  return info;
}

function lapScore(row: ProviderRecord): number {
  const lapNumber = numberValue(row.lap_number) ?? 0;
  return (lapNumber * 1_000_000_000) + (timestamp(row) % 1_000_000_000);
}

function stintScore(row: ProviderRecord): number {
  const stintNumber = numberValue(row.stint_number) ?? 0;
  const lapStart = numberValue(row.lap_start) ?? 0;
  const lapEnd = numberValue(row.lap_end) ?? lapStart;
  return (stintNumber * 1000) + lapEnd + lapStart / 1000;
}

function formatDuration(value: unknown): string {
  const duration = numberValue(value);
  if (duration === undefined || duration <= 0) return "--";

  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;
  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

function formatSector(value: unknown): string | undefined {
  const duration = numberValue(value);
  return duration === undefined || duration <= 0 ? undefined : duration.toFixed(3);
}

function formatDelta(value: unknown, leaderText: string): string {
  const text = stringValue(value);
  if (text) {
    const numeric = numberValue(text);
    if (numeric !== undefined) return numeric === 0 ? leaderText : `+${numeric.toFixed(3)}`;
    return text;
  }

  const numeric = numberValue(value);
  if (numeric === undefined) return "--";
  return numeric === 0 ? leaderText : `+${numeric.toFixed(3)}`;
}

function sessionStatus(session: ProviderRecord, nowMs = Date.now()): SessionStatus {
  const start = stringValue(session.date_start) ? Date.parse(String(session.date_start)) : NaN;
  const end = stringValue(session.date_end) ? Date.parse(String(session.date_end)) : NaN;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return "Not Live";

  if (nowMs >= start && nowMs <= end) return "Live";
  return nowMs < start ? "Not Live" : "Historical";
}

function timingWindowStart(session: ProviderRecord, lapRows: ProviderRecord[], nowMs = Date.now()): string {
  const latestLapStart = lapRows.reduce((latest, lap) => Math.max(latest, timestamp(lap)), 0);
  const sessionEnd = stringValue(session.date_end) ? Date.parse(String(session.date_end)) : NaN;
  const status = sessionStatus(session, nowMs);
  const anchor = latestLapStart || (status === "Live" || !Number.isFinite(sessionEnd) ? nowMs : sessionEnd);
  return new Date(anchor - 20 * 60 * 1000).toISOString();
}

function pitStopCounts(pitRows: ProviderRecord[]): Map<number, number> {
  const stops = new Map<number, number>();

  for (const pit of pitRows) {
    const driver = driverNumber(pit);
    if (driver === undefined) continue;
    stops.set(driver, (stops.get(driver) ?? 0) + 1);
  }

  return stops;
}

function stintAge(stint: ProviderRecord | undefined, latestLap: ProviderRecord | undefined): number | undefined {
  if (!stint) return undefined;

  const start = numberValue(stint.lap_start);
  const end = numberValue(stint.lap_end) ?? numberValue(latestLap?.lap_number);
  if (start === undefined || end === undefined) return undefined;

  return Math.max(0, Math.round(end - start + 1));
}

function raceControlMessages(raceControlRows: ProviderRecord[]): string[] {
  return [...raceControlRows]
    .filter((row) => stringValue(row.message))
    .sort((a, b) => timestamp(b) - timestamp(a))
    .slice(0, 4)
    .map((row) => stringValue(row.message) ?? "")
    .filter(Boolean);
}

function fallbackSnapshot(reason = "Timing is temporarily unavailable."): LiveTimingSnapshot {
  return {
    sessionName: "Timing unavailable",
    rows: [],
    status: "Unavailable",
    source: "No verified timing",
    lastUpdated: new Date().toISOString(),
    messages: [reason]
  };
}

async function jolpicaClassificationSnapshot(reason: string): Promise<LiveTimingSnapshot> {
  const year = new Date().getUTCFullYear();
  const json = record(await getJolpicaJson(`/${year}/last/results.json`));
  const raceTable = record(record(json.MRData).RaceTable);
  const race = record(rows(raceTable.Races)[0]);
  const resultRows = rows(race.Results);

  if (!resultRows.length) {
    return fallbackSnapshot("No verified classification is available yet. Please try again shortly.");
  }

  const raceName = stringValue(race.raceName) ?? "Latest Grand Prix";
  const circuit = record(race.Circuit);
  const location = record(circuit.Location);

  const providerNote = reason.includes("credentials")
    ? "OpenF1 live access is not configured on the server."
    : reason.includes("429")
      ? "OpenF1 is temporarily rate limiting detailed timing requests."
      : "OpenF1 detailed timing is temporarily unavailable.";

  return {
    sessionName: `${raceName} Classification`,
    meetingName: raceName,
    circuitName: stringValue(circuit.circuitName),
    countryName: stringValue(location.country),
    source: "Jolpica classification",
    status: "Historical",
    sessionDate: stringValue(race.date),
    lastUpdated: new Date().toISOString(),
    rows: resultRows.map((result) => {
      const driver = record(result.Driver);
      const constructor = record(result.Constructor);
      const fastestLap = record(result.FastestLap);
      const fastestTime = record(fastestLap.Time);
      const resultTime = record(result.Time);
      const position = numberValue(result.position) ?? 0;
      const teamName = stringValue(constructor.name) ?? "Team";
      const driverCode = stringValue(driver.code) ?? stringValue(driver.familyName)?.slice(0, 3).toUpperCase() ?? String(numberValue(result.number) ?? position);
      const driverName = [stringValue(driver.givenName), stringValue(driver.familyName)].filter(Boolean).join(" ");
      const finishStatus = stringValue(result.status);
      const raceGap = position === 1 ? "Leader" : finishStatus && finishStatus !== "Finished" ? finishStatus : stringValue(resultTime.time) ?? "--";

      return {
        position,
        driverId: stringValue(driver.driverId) ?? String(numberValue(result.number) ?? position),
        driverCode,
        driverName: driverName || driverCode,
        driverNumber: numberValue(result.number) ?? numberValue(driver.permanentNumber),
        teamName,
        teamColour: teamColours[teamName],
        gapToLeader: raceGap,
        interval: "-",
        lastLap: "--",
        bestLap: stringValue(fastestTime.time) ?? "--",
        sector1: undefined,
        sector2: undefined,
        sector3: undefined,
        pitStops: undefined,
        tyreCompound: undefined,
        stintAge: undefined,
        drs: undefined
      };
    }),
    messages: [
      `${providerNote} Showing the latest verified Jolpica race classification.`,
      "Classification is from the latest completed race. Detailed timing will retry automatically."
    ]
  };
}

export async function getLiveTimingSnapshot(): Promise<LiveTimingSnapshot> {
  return cached("live-timing", 60_000, async () => {
    try {
      const sessions = await getJson("/sessions?session_key=latest");
      const session = record(Array.isArray(sessions) ? sessions[0] : undefined);
      const sessionKey = numberValue(session.session_key);

      if (sessionKey === undefined) {
        throw new Error("OpenF1 did not return a latest session.");
      }

      const scheduledStatus = sessionStatus(session);
      const liveAccessConfigured = Boolean(process.env.OPENF1_ACCESS_TOKEN || (process.env.OPENF1_USERNAME && process.env.OPENF1_PASSWORD));
      if (scheduledStatus === "Live" && !liveAccessConfigured) throw new Error("OpenF1 live access requires server-side OpenF1 credentials.");

      const [
        drivers,
        laps,
        stints,
        pits,
        raceControl
      ] = await getJsonBatch([
        `/drivers?session_key=${sessionKey}`,
        `/laps?session_key=${sessionKey}`,
        `/stints?session_key=${sessionKey}`,
        `/pit?session_key=${sessionKey}`,
        `/race_control?session_key=${sessionKey}`
      ]);

      const driverRows = rows(drivers);
      const lapRows = rows(laps);
      const stintRows = rows(stints);
      const pitRows = rows(pits);
      const raceControlRows = rows(raceControl);
      const timingSince = encodeURIComponent(timingWindowStart(session, lapRows));
      const [positions, intervals] = await getJsonBatch([
        scheduledStatus === "Historical" ? `/session_result?session_key=${sessionKey}` : `/position?session_key=${sessionKey}&date>=${timingSince}`,
        ...(scheduledStatus === "Historical" ? [] : [`/intervals?session_key=${sessionKey}&date>=${timingSince}`])
      ]);
      const positionRows = rows(positions);
      const intervalRows = rows(intervals);

      const provisionalPositions = latestByDriver(positionRows);
      const missingDriverNumbers = driverRows
        .map(driverNumber)
        .filter((driver): driver is number => driver !== undefined && !provisionalPositions.has(driver))
        .slice(0, 8);

      if (missingDriverNumbers.length) {
        const supplementalPositions = await getJsonBatch(
          missingDriverNumbers.map((driver) => `/position?session_key=${sessionKey}&driver_number=${driver}`)
        );
        for (const payload of supplementalPositions) positionRows.push(...rows(payload));
      }

      const latestPositions = latestByDriver(positionRows);
      const latestIntervals = latestByDriver(intervalRows);
      const latestLaps = latestByDriver(lapRows.filter((lap) => (numberValue(lap.lap_duration) ?? 0) > 0), lapScore);
      const bestLaps = bestLapByDriver(lapRows);
      const latestStints = latestByDriver(stintRows, stintScore);
      const driversByNumber = driverInfoMap(driverRows);
      const pitCounts = pitStopCounts(pitRows);

      const timingRows = Array.from(latestPositions.values())
        .filter((position) => driverNumber(position) !== undefined)
        .sort((a, b) => (numberValue(a.position) ?? 999) - (numberValue(b.position) ?? 999))
        .slice(0, 24)
        .map((position) => {
          const driver = Number(driverNumber(position));
          const positionNumber = numberValue(position.position) ?? 0;
          const driverInfo = driversByNumber.get(driver);
          const interval = latestIntervals.get(driver);
          const latestLap = latestLaps.get(driver);
          const bestLap = bestLaps.get(driver);
          const stint = latestStints.get(driver);
          const isLeader = positionNumber === 1;

          return {
            position: positionNumber,
            driverId: String(driver),
            driverCode: driverInfo?.code ?? String(driver),
            driverName: driverInfo?.name,
            driverNumber: driver,
            teamName: driverInfo?.teamName ?? "OpenF1",
            teamColour: driverInfo?.teamColour,
            gapToLeader: position.dsq ? "DSQ" : position.dns ? "DNS" : position.dnf ? "DNF" : isLeader ? "Leader" : formatDelta(scheduledStatus === "Historical" ? position.gap_to_leader : interval?.gap_to_leader, "Leader"),
            interval: isLeader || scheduledStatus === "Historical" ? "-" : formatDelta(interval?.interval, "-"),
            lastLap: formatDuration(latestLap?.lap_duration),
            bestLap: formatDuration(bestLap?.lap_duration),
            sector1: formatSector(latestLap?.duration_sector_1),
            sector2: formatSector(latestLap?.duration_sector_2),
            sector3: formatSector(latestLap?.duration_sector_3),
            pitStops: pitRows.length ? pitCounts.get(driver) ?? 0 : undefined,
            tyreCompound: stringValue(stint?.compound),
            stintAge: stintAge(stint, latestLap),
            drs: undefined
          };
        });

      if (!timingRows.length) {
        throw new Error("OpenF1 returned no timing rows.");
      }

      const latestTimestamp = Math.max(0, ...positionRows.map(timestamp), ...lapRows.map(timestamp), ...raceControlRows.map(timestamp));
      const status = scheduledStatus === "Live" && Date.now() - latestTimestamp > 120_000 ? "Not Live" : scheduledStatus;
      const country = stringValue(session.country_name);
      const circuit = stringValue(session.circuit_short_name);
      const meeting = country ? `${country} Grand Prix` : "Formula 1";
      const sessionName = [country, stringValue(session.session_name)].filter(Boolean).join(" ");
      const providerMessage = status === "Live"
        ? "OpenF1 classifies this session as live. The board refreshes from the timing endpoints."
        : `OpenF1 latest public session is ${sessionName || meeting}${circuit ? ` at ${circuit}` : ""}; showing ${status.toLowerCase()} timing.`;
      const controlMessages = raceControlMessages(raceControlRows);

      return {
        sessionName: sessionName || "Formula 1 Session",
        meetingName: meeting,
        circuitName: circuit,
        countryName: country,
        source: "OpenF1",
        status,
        sessionDate: stringValue(session.date_start),
        dataTimestamp: latestTimestamp ? new Date(latestTimestamp).toISOString() : undefined,
        liveAccessConfigured,
        lastUpdated: new Date().toISOString(),
        rows: timingRows,
        messages: [providerMessage, ...controlMessages].slice(0, 5)
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "OpenF1 request failed.";
      console.error("OpenF1 timing unavailable:", message);
      try {
        return await jolpicaClassificationSnapshot(message);
      } catch (classificationError) {
        console.error("Jolpica timing fallback unavailable:", classificationError instanceof Error ? classificationError.message : "Request failed");
        return {
          ...verifiedSnapshot.timing,
          status: "Historical",
          source: "OpenF1 saved snapshot",
          messages: ["Provider refresh is delayed. Showing the last verified completed session, captured " + new Date(verifiedSnapshot.timing.lastUpdated).toISOString() + ".", ...verifiedSnapshot.timing.messages.slice(1)]
        } as LiveTimingSnapshot;
      }
    }
  });
}
