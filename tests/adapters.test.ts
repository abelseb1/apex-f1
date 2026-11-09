import { describe, expect, it } from "vitest";
import {
  adaptConstructorStanding,
  adaptJolpicaRace,
  adaptDriverStanding,
  adaptJolpicaConstructor,
  adaptJolpicaDriver,
  adaptJolpicaSessions,
  adaptQualifyingResult,
  isRace
} from "@/lib/api/adapters";
import { mockRaces } from "@/lib/api/mockData";

describe("Jolpica adapters", () => {
  it("normalizes driver records", () => {
    expect(adaptJolpicaDriver({
      driverId: "norris",
      permanentNumber: "4",
      code: "NOR",
      givenName: "Lando",
      familyName: "Norris",
      nationality: "British"
    })).toMatchObject({
      id: "norris",
      code: "NOR",
      givenName: "Lando",
      familyName: "Norris"
    });
  });

  it("normalizes constructor records", () => {
    expect(adaptJolpicaConstructor({
      constructorId: "mclaren",
      name: "McLaren",
      nationality: "British"
    })).toMatchObject({
      id: "mclaren",
      name: "McLaren",
      drivers: []
    });
  });

  it("normalizes standings rows", () => {
    const row = adaptDriverStanding({
      position: "1",
      points: "275",
      wins: "7",
      Driver: {
        driverId: "verstappen",
        code: "VER",
        givenName: "Max",
        familyName: "Verstappen",
        nationality: "Dutch"
      }
    });

    expect(row).toEqual({
      position: 1,
      entityId: "verstappen",
      name: "Max Verstappen",
      points: 275,
      wins: 7
    });
  });

  it("normalizes constructor standings rows", () => {
    expect(adaptConstructorStanding({
      position: "2",
      points: "301",
      wins: "4",
      Constructor: {
        constructorId: "ferrari",
        name: "Ferrari",
        nationality: "Italian"
      }
    })).toMatchObject({
      position: 2,
      entityId: "ferrari",
      points: 301,
      wins: 4
    });
  });

  it("normalizes qualifying rows", () => {
    expect(adaptQualifyingResult({
      position: "3",
      Q1: "1:26.500",
      Q2: "1:26.000",
      Q3: "1:25.700",
      Driver: {
        driverId: "leclerc",
        code: "LEC",
        givenName: "Charles",
        familyName: "Leclerc",
        nationality: "Monegasque"
      },
      Constructor: { name: "Ferrari" }
    })).toMatchObject({
      position: 3,
      driverCode: "LEC",
      constructorName: "Ferrari",
      q3: "1:25.700"
    });
  });

  it("normalizes race sessions from Jolpica calendar payloads", () => {
    const race = adaptJolpicaRace({
      season: "2026",
      round: "9",
      raceName: "British Grand Prix",
      date: "2026-07-05",
      time: "14:00:00Z",
      Circuit: {
        circuitId: "silverstone",
        circuitName: "Silverstone Circuit",
        Location: {
          locality: "Silverstone",
          country: "UK",
          lat: "52.0786",
          long: "-1.0169"
        }
      },
      FirstPractice: { date: "2026-07-03", time: "11:30:00Z" },
      Qualifying: { date: "2026-07-04", time: "14:00:00Z" }
    }, 2026, new Date("2026-07-04T12:00:00Z"));

    expect(race).toMatchObject({
      id: "2026-9",
      raceName: "British Grand Prix",
      circuit: { id: "silverstone", name: "Silverstone Circuit" }
    });
    expect(race.sessions.map((session) => session.type)).toEqual(["Practice 1", "Qualifying", "Race"]);
    expect(race.sessions.map((session) => session.status)).toEqual(["completed", "upcoming", "upcoming"]);
  });

  it("supports sprint shootout session names", () => {
    const sessions = adaptJolpicaSessions({
      date: "2026-05-03",
      time: "20:00:00Z",
      SprintShootout: { date: "2026-05-02", time: "16:30:00Z" },
      Sprint: { date: "2026-05-03", time: "15:00:00Z" }
    }, "2026-6", new Date("2026-05-02T12:00:00Z"));

    expect(sessions.map((session) => session.type)).toEqual(["Sprint Qualifying", "Sprint", "Race"]);
  });
});

describe("type guards", () => {
  it("recognizes race-shaped objects", () => {
    expect(isRace(mockRaces[0])).toBe(true);
    expect(isRace({ raceName: "Only a name" })).toBe(false);
  });
});
