export type SessionType =
  | "Practice 1"
  | "Practice 2"
  | "Practice 3"
  | "Sprint Qualifying"
  | "Sprint"
  | "Qualifying"
  | "Race";

export type RaceStatus = "upcoming" | "live" | "completed";

export interface Circuit {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Session {
  id: string;
  raceId: string;
  type: SessionType;
  startsAt: string;
  status: RaceStatus;
}

export interface Race {
  id: string;
  season: number;
  round: number;
  raceName: string;
  grandPrix: string;
  circuit: Circuit;
  raceDate: string;
  sessions: Session[];
  status: RaceStatus;
  historicalWinners?: string[];
}

export interface Driver {
  id: string;
  permanentNumber?: string;
  code: string;
  givenName: string;
  familyName: string;
  nationality: string;
  dateOfBirth?: string;
  constructorId?: string;
  constructorName?: string;
  headshotUrl?: string;
  portraitStyle?: "cutout";
  points?: number;
  wins?: number;
  podiums?: number;
  poles?: number;
  fastestLaps?: number;
  recentResults?: string[];
  qualifyingDelta?: string;
  racePaceSummary?: string;
}

export interface Constructor {
  id: string;
  name: string;
  nationality: string;
  drivers: string[];
  carImageUrl?: string;
  points?: number;
  wins?: number;
  podiums?: number;
  recentForm?: string[];
  racesEntered?: number;
  topTens?: number;
  poles?: number;
  fastestLaps?: number;
}

export interface LiveTimingRow {
  position: number;
  driverId: string;
  driverCode: string;
  driverName?: string;
  driverNumber?: number;
  teamName: string;
  teamColour?: string;
  gapToLeader: string;
  interval: string;
  lastLap: string;
  bestLap: string;
  sector1?: string;
  sector2?: string;
  sector3?: string;
  pitStops?: number;
  tyreCompound?: string;
  stintAge?: number;
  drs?: boolean;
}

export interface Lap {
  driverId: string;
  lapNumber: number;
  lapTime: string;
  compound?: string;
}

export interface Stint {
  driverId: string;
  compound: string;
  startLap: number;
  endLap?: number;
}

export interface QualifyingResult {
  position: number;
  driverId: string;
  driverCode: string;
  constructorName: string;
  q1?: string;
  q2?: string;
  q3?: string;
  gap?: string;
  eliminatedIn?: "Q1" | "Q2";
}

export interface Standing {
  position: number;
  entityId: string;
  name: string;
  points: number;
  wins: number;
  podiums?: number;
  positionChange?: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  summary: string;
  url: string;
  imageUrl?: string;
  category: "race" | "technical" | "driver" | "team" | "general";
}

export interface RaceInsight {
  id: string;
  title: string;
  description: string;
  type: "line" | "bar" | "timeline" | "placeholder";
  data: Array<Record<string, string | number>>;
}

export interface LiveTimingSnapshot {
  sessionName: string;
  meetingName?: string;
  circuitName?: string;
  countryName?: string;
  source?: string;
  status: "Live" | "Not Live" | "Historical" | "Mock" | "Unavailable";
  sessionDate?: string;
  dataTimestamp?: string;
  liveAccessConfigured?: boolean;
  lastUpdated: string;
  rows: LiveTimingRow[];
  messages: string[];
}
