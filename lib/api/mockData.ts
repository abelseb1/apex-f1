import type {
  Constructor,
  Driver,
  LiveTimingSnapshot,
  NewsArticle,
  QualifyingResult,
  Race,
  RaceInsight,
  Standing
} from "./types";

const season = new Date().getUTCFullYear();

const driverCard = (id: string) => `/f1-assets/drivers/${id}.png`;
const carTile = (id: string) => `/f1-assets/cars/${id}.png`;

export const mockConstructors: Constructor[] = [
  { id: "red_bull", name: "Red Bull Racing", nationality: "Austrian", drivers: ["VER", "HAD"], carImageUrl: carTile("red_bull"), points: 78, wins: 0, podiums: 3, recentForm: ["P5", "P7", "P6"] },
  { id: "racing_bulls", name: "Racing Bulls", nationality: "Italian", drivers: ["LAW", "LIN"], carImageUrl: carTile("racing_bulls"), points: 10, wins: 0, podiums: 0, recentForm: ["P14", "P15", "P13"] },
  { id: "haas", name: "Haas F1 Team", nationality: "American", drivers: ["OCO", "BEA"], carImageUrl: carTile("haas"), points: 40, wins: 0, podiums: 0, recentForm: ["P9", "P12", "P11"] },
  { id: "audi", name: "Audi", nationality: "German", drivers: ["HUL", "BOR"], carImageUrl: carTile("audi"), points: 53, wins: 0, podiums: 1, recentForm: ["P8", "P10", "P7"] },
  { id: "mercedes", name: "Mercedes", nationality: "German", drivers: ["RUS", "ANT"], carImageUrl: carTile("mercedes"), points: 302, wins: 7, podiums: 12, recentForm: ["P1", "P2", "P1"] },
  { id: "ferrari", name: "Ferrari", nationality: "Italian", drivers: ["LEC", "HAM"], carImageUrl: carTile("ferrari"), points: 204, wins: 2, podiums: 8, recentForm: ["P3", "P1", "P4"] },
  { id: "alpine", name: "Alpine", nationality: "French", drivers: ["GAS", "COL"], carImageUrl: carTile("alpine"), points: 50, wins: 0, podiums: 1, recentForm: ["P7", "P9", "P8"] },
  { id: "williams", name: "Williams", nationality: "British", drivers: ["SAI", "ALB"], carImageUrl: carTile("williams"), points: 67, wins: 0, podiums: 1, recentForm: ["P10", "P6", "P8"] },
  { id: "cadillac", name: "Cadillac", nationality: "American", drivers: ["PER", "BOT"], carImageUrl: carTile("cadillac"), points: 28, wins: 0, podiums: 0, recentForm: ["P12", "P11", "P10"] },
  { id: "mclaren", name: "McLaren", nationality: "British", drivers: ["NOR", "PIA"], carImageUrl: carTile("mclaren"), points: 159, wins: 0, podiums: 7, recentForm: ["P4", "P5", "P2"] },
  { id: "aston_martin", name: "Aston Martin", nationality: "British", drivers: ["ALO", "STR"], carImageUrl: carTile("aston_martin"), points: 71, wins: 0, podiums: 2, recentForm: ["P6", "P8", "P5"] }
];

export const mockDrivers: Driver[] = [
  { id: "pierre_gasly", permanentNumber: "10", code: "GAS", givenName: "Pierre", familyName: "Gasly", nationality: "French", dateOfBirth: "1996-02-07", constructorId: "alpine", constructorName: "Alpine", headshotUrl: driverCard("pierre_gasly"), points: 36, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, recentResults: ["7", "9", "8"], qualifyingDelta: "-0.04s to teammate", racePaceSummary: "Sharp race starts and consistent tyre warm-up on medium stints." },
  { id: "franco_colapinto", permanentNumber: "43", code: "COL", givenName: "Franco", familyName: "Colapinto", nationality: "Argentine", dateOfBirth: "2003-05-27", constructorId: "alpine", constructorName: "Alpine", headshotUrl: driverCard("franco_colapinto"), points: 14, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["11", "12", "10"], qualifyingDelta: "+0.04s to teammate", racePaceSummary: "Improving long-run consistency with clean final-stint execution." },
  { id: "fernando_alonso", permanentNumber: "14", code: "ALO", givenName: "Fernando", familyName: "Alonso", nationality: "Spanish", dateOfBirth: "1981-07-29", constructorId: "aston_martin", constructorName: "Aston Martin", headshotUrl: driverCard("fernando_alonso"), points: 48, wins: 0, podiums: 2, poles: 0, fastestLaps: 1, recentResults: ["6", "8", "5"], qualifyingDelta: "-0.11s to teammate", racePaceSummary: "Excellent race management when track position is hard to recover." },
  { id: "lance_stroll", permanentNumber: "18", code: "STR", givenName: "Lance", familyName: "Stroll", nationality: "Canadian", dateOfBirth: "1998-10-29", constructorId: "aston_martin", constructorName: "Aston Martin", headshotUrl: driverCard("lance_stroll"), points: 23, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["10", "13", "9"], qualifyingDelta: "+0.11s to teammate", racePaceSummary: "Strong tyre life on heavy-fuel runs and reliable wet-weather pace." },
  { id: "nico_hulkenberg", permanentNumber: "27", code: "HUL", givenName: "Nico", familyName: "Hulkenberg", nationality: "German", dateOfBirth: "1987-08-19", constructorId: "audi", constructorName: "Audi", headshotUrl: driverCard("nico_hulkenberg"), points: 33, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, recentResults: ["8", "10", "7"], qualifyingDelta: "-0.08s to teammate", racePaceSummary: "Consistently converts Q2 pace into points when strategy windows open." },
  { id: "gabriel_bortoleto", permanentNumber: "5", code: "BOR", givenName: "Gabriel", familyName: "Bortoleto", nationality: "Brazilian", dateOfBirth: "2004-10-14", constructorId: "audi", constructorName: "Audi", headshotUrl: driverCard("gabriel_bortoleto"), points: 20, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["12", "9", "11"], qualifyingDelta: "+0.08s to teammate", racePaceSummary: "Clean wheel-to-wheel racecraft with improving opening-lap gains." },
  { id: "sergio_perez", permanentNumber: "11", code: "PER", givenName: "Sergio", familyName: "Perez", nationality: "Mexican", dateOfBirth: "1990-01-26", constructorId: "cadillac", constructorName: "Cadillac", headshotUrl: driverCard("sergio_perez"), points: 18, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["12", "11", "10"], qualifyingDelta: "-0.03s to teammate", racePaceSummary: "Best Cadillac race pace over long runs and low-deg circuits." },
  { id: "valtteri_bottas", permanentNumber: "77", code: "BOT", givenName: "Valtteri", familyName: "Bottas", nationality: "Finnish", dateOfBirth: "1989-08-28", constructorId: "cadillac", constructorName: "Cadillac", headshotUrl: driverCard("valtteri_bottas"), points: 10, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["14", "13", "12"], qualifyingDelta: "+0.03s to teammate", racePaceSummary: "Smooth qualifying execution and tidy first-stint tyre control." },
  { id: "charles_leclerc", permanentNumber: "16", code: "LEC", givenName: "Charles", familyName: "Leclerc", nationality: "Monegasque", dateOfBirth: "1997-10-16", constructorId: "ferrari", constructorName: "Ferrari", headshotUrl: driverCard("charles_leclerc"), points: 79, wins: 1, podiums: 4, poles: 2, fastestLaps: 1, recentResults: ["6", "2", "5"], qualifyingDelta: "-0.06s to teammate", racePaceSummary: "Strongest single-lap Ferrari trace and decisive late-braking zones." },
  { id: "lewis_hamilton", permanentNumber: "44", code: "HAM", givenName: "Lewis", familyName: "Hamilton", nationality: "British", dateOfBirth: "1985-01-07", constructorId: "ferrari", constructorName: "Ferrari", headshotUrl: driverCard("lewis_hamilton"), points: 125, wins: 1, podiums: 4, poles: 1, fastestLaps: 1, recentResults: ["3", "7", "1"], qualifyingDelta: "+0.06s to teammate", racePaceSummary: "Excellent tyre saving and race pace across medium-compound stints." },
  { id: "esteban_ocon", permanentNumber: "31", code: "OCO", givenName: "Esteban", familyName: "Ocon", nationality: "French", dateOfBirth: "1996-09-17", constructorId: "haas", constructorName: "Haas F1 Team", headshotUrl: driverCard("esteban_ocon"), points: 28, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["9", "12", "11"], qualifyingDelta: "-0.02s to teammate", racePaceSummary: "Keeps the Haas package in the points fight on high-deg weekends." },
  { id: "oliver_bearman", permanentNumber: "87", code: "BEA", givenName: "Oliver", familyName: "Bearman", nationality: "British", dateOfBirth: "2005-05-08", constructorId: "haas", constructorName: "Haas F1 Team", headshotUrl: driverCard("oliver_bearman"), points: 12, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["13", "14", "12"], qualifyingDelta: "+0.02s to teammate", racePaceSummary: "Confident over kerbs with a cleaner second stint than early-season form." },
  { id: "lando_norris", permanentNumber: "1", code: "NOR", givenName: "Lando", familyName: "Norris", nationality: "British", dateOfBirth: "1999-11-13", constructorId: "mclaren", constructorName: "McLaren", headshotUrl: driverCard("lando_norris"), points: 79, wins: 0, podiums: 3, poles: 1, fastestLaps: 1, recentResults: ["5", "4", "6"], qualifyingDelta: "-0.01s to teammate", racePaceSummary: "Most consistent final-stint lap spread in the McLaren sample." },
  { id: "oscar_piastri", permanentNumber: "81", code: "PIA", givenName: "Oscar", familyName: "Piastri", nationality: "Australian", dateOfBirth: "2001-04-06", constructorId: "mclaren", constructorName: "McLaren", headshotUrl: driverCard("oscar_piastri"), points: 80, wins: 0, podiums: 4, poles: 1, fastestLaps: 1, recentResults: ["4", "5", "2"], qualifyingDelta: "+0.01s to teammate", racePaceSummary: "Clean race execution with especially low variance in sector two." },
  { id: "george_russell", permanentNumber: "63", code: "RUS", givenName: "George", familyName: "Russell", nationality: "British", dateOfBirth: "1998-02-15", constructorId: "mercedes", constructorName: "Mercedes", headshotUrl: driverCard("george_russell"), points: 131, wins: 2, podiums: 5, poles: 2, fastestLaps: 1, recentResults: ["2", "8", "1"], qualifyingDelta: "+0.03s to teammate", racePaceSummary: "Reliable podium conversion with tidy energy deployment in race trim." },
  { id: "kimi_antonelli", permanentNumber: "12", code: "ANT", givenName: "Kimi", familyName: "Antonelli", nationality: "Italian", dateOfBirth: "2006-08-25", constructorId: "mercedes", constructorName: "Mercedes", headshotUrl: driverCard("kimi_antonelli"), points: 171, wins: 5, podiums: 7, poles: 3, fastestLaps: 2, recentResults: ["1", "1", "3"], qualifyingDelta: "-0.03s to teammate", racePaceSummary: "Fastest combined race stint pace in the mock 2026 sample." },
  { id: "liam_lawson", permanentNumber: "30", code: "LAW", givenName: "Liam", familyName: "Lawson", nationality: "New Zealander", dateOfBirth: "2002-02-11", constructorId: "racing_bulls", constructorName: "Racing Bulls", headshotUrl: driverCard("liam_lawson"), points: 8, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["14", "16", "13"], qualifyingDelta: "-0.05s to teammate", racePaceSummary: "Good traction-limited exits and aggressive opening laps." },
  { id: "arvid_lindblad", permanentNumber: "41", code: "LIN", givenName: "Arvid", familyName: "Lindblad", nationality: "British", dateOfBirth: "2007-08-08", constructorId: "racing_bulls", constructorName: "Racing Bulls", headshotUrl: driverCard("arvid_lindblad"), points: 2, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["17", "15", "14"], qualifyingDelta: "+0.05s to teammate", racePaceSummary: "High upside over one lap with race pace still converging." },
  { id: "max_verstappen", permanentNumber: "3", code: "VER", givenName: "Max", familyName: "Verstappen", nationality: "Dutch", dateOfBirth: "1997-09-30", constructorId: "red_bull", constructorName: "Red Bull Racing", headshotUrl: driverCard("max_verstappen"), points: 72, wins: 0, podiums: 3, poles: 1, fastestLaps: 1, recentResults: ["7", "3", "6"], qualifyingDelta: "-0.14s to teammate", racePaceSummary: "Still the class of the Red Bull garage through high-speed rotation." },
  { id: "isack_hadjar", permanentNumber: "6", code: "HAD", givenName: "Isack", familyName: "Hadjar", nationality: "French", dateOfBirth: "2004-09-28", constructorId: "red_bull", constructorName: "Red Bull Racing", headshotUrl: driverCard("isack_hadjar"), points: 6, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["15", "17", "16"], qualifyingDelta: "+0.14s to teammate", racePaceSummary: "Sharper on low-fuel laps than the race average suggests." },
  { id: "carlos_sainz", permanentNumber: "55", code: "SAI", givenName: "Carlos", familyName: "Sainz", nationality: "Spanish", dateOfBirth: "1994-09-01", constructorId: "williams", constructorName: "Williams", headshotUrl: driverCard("carlos_sainz"), points: 42, wins: 0, podiums: 1, poles: 0, fastestLaps: 1, recentResults: ["10", "6", "8"], qualifyingDelta: "-0.09s to teammate", racePaceSummary: "Strong Williams benchmark with efficient tyre use in traffic." },
  { id: "alexander_albon", permanentNumber: "23", code: "ALB", givenName: "Alexander", familyName: "Albon", nationality: "Thai", dateOfBirth: "1996-03-23", constructorId: "williams", constructorName: "Williams", headshotUrl: driverCard("alexander_albon"), points: 25, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, recentResults: ["11", "7", "9"], qualifyingDelta: "+0.09s to teammate", racePaceSummary: "Excellent defensive racecraft when Williams runs in the lower points." }
];

export const mockRaces: Race[] = [
  {
    id: "british-gp",
    season,
    round: 12,
    raceName: "British Grand Prix",
    grandPrix: "Great Britain",
    raceDate: `${season}-07-05T14:00:00Z`,
    status: "live",
    circuit: { id: "silverstone", name: "Silverstone Circuit", city: "Silverstone", country: "United Kingdom", latitude: 52.0786, longitude: -1.0169 },
    historicalWinners: ["Lewis Hamilton", "Max Verstappen", "Carlos Sainz"],
    sessions: [
      { id: "british-fp1", raceId: "british-gp", type: "Practice 1", startsAt: `${season}-07-03T11:30:00Z`, status: "completed" },
      { id: "british-fp2", raceId: "british-gp", type: "Practice 2", startsAt: `${season}-07-03T15:00:00Z`, status: "completed" },
      { id: "british-fp3", raceId: "british-gp", type: "Practice 3", startsAt: `${season}-07-04T10:30:00Z`, status: "completed" },
      { id: "british-qualifying", raceId: "british-gp", type: "Qualifying", startsAt: `${season}-07-04T14:00:00Z`, status: "live" },
      { id: "british-race", raceId: "british-gp", type: "Race", startsAt: `${season}-07-05T14:00:00Z`, status: "upcoming" }
    ]
  },
  {
    id: "hungarian-gp",
    season,
    round: 13,
    raceName: "Hungarian Grand Prix",
    grandPrix: "Hungary",
    raceDate: `${season}-07-19T13:00:00Z`,
    status: "upcoming",
    circuit: { id: "hungaroring", name: "Hungaroring", city: "Mogyorod", country: "Hungary" },
    historicalWinners: ["Max Verstappen", "Esteban Ocon", "Lewis Hamilton"],
    sessions: [
      { id: "hungarian-fp1", raceId: "hungarian-gp", type: "Practice 1", startsAt: `${season}-07-17T11:30:00Z`, status: "upcoming" },
      { id: "hungarian-fp2", raceId: "hungarian-gp", type: "Practice 2", startsAt: `${season}-07-17T15:00:00Z`, status: "upcoming" },
      { id: "hungarian-fp3", raceId: "hungarian-gp", type: "Practice 3", startsAt: `${season}-07-18T10:30:00Z`, status: "upcoming" },
      { id: "hungarian-qualifying", raceId: "hungarian-gp", type: "Qualifying", startsAt: `${season}-07-18T14:00:00Z`, status: "upcoming" },
      { id: "hungarian-race", raceId: "hungarian-gp", type: "Race", startsAt: `${season}-07-19T13:00:00Z`, status: "upcoming" }
    ]
  },
  {
    id: "austrian-gp",
    season,
    round: 11,
    raceName: "Austrian Grand Prix",
    grandPrix: "Austria",
    raceDate: `${season}-06-28T13:00:00Z`,
    status: "completed",
    circuit: { id: "red-bull-ring", name: "Red Bull Ring", city: "Spielberg", country: "Austria" },
    historicalWinners: ["Charles Leclerc", "Max Verstappen", "George Russell"],
    sessions: [
      { id: "austrian-qualifying", raceId: "austrian-gp", type: "Qualifying", startsAt: `${season}-06-27T14:00:00Z`, status: "completed" },
      { id: "austrian-race", raceId: "austrian-gp", type: "Race", startsAt: `${season}-06-28T13:00:00Z`, status: "completed" }
    ]
  }
];

const positionChanges = [0, 1, -1, 2, 0, -2, 1, 0, -1, 1, 0, 2, -2, 1, 0, -1, 1, 0, 0, -1, 1, 0];

export const mockDriverStandings: Standing[] = [...mockDrivers]
  .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
  .map((driver, index) => ({
  position: index + 1,
  entityId: driver.id,
  name: `${driver.givenName} ${driver.familyName}`,
  points: driver.points ?? 0,
  wins: driver.wins ?? 0,
  podiums: driver.podiums,
  positionChange: positionChanges[index] ?? 0
}));

export const mockConstructorStandings: Standing[] = [...mockConstructors]
  .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
  .map((team, index) => ({
  position: index + 1,
  entityId: team.id,
  name: team.name,
  points: team.points ?? 0,
  wins: team.wins ?? 0,
  podiums: team.podiums,
  positionChange: positionChanges[index] ?? 0
}));

export const mockQualifyingResults: QualifyingResult[] = [
  { position: 1, driverId: "charles_leclerc", driverCode: "LEC", constructorName: "Ferrari", q1: "1:26.212", q2: "1:25.771", q3: "1:25.104", gap: "+0.000" },
  { position: 2, driverId: "max_verstappen", driverCode: "VER", constructorName: "Red Bull Racing", q1: "1:26.401", q2: "1:25.802", q3: "1:25.168", gap: "+0.064" },
  { position: 3, driverId: "lando_norris", driverCode: "NOR", constructorName: "McLaren", q1: "1:26.522", q2: "1:25.956", q3: "1:25.221", gap: "+0.117" },
  { position: 4, driverId: "lewis_hamilton", driverCode: "HAM", constructorName: "Ferrari", q1: "1:26.733", q2: "1:26.015", q3: "1:25.409", gap: "+0.305" },
  { position: 5, driverId: "oscar_piastri", driverCode: "PIA", constructorName: "McLaren", q1: "1:26.784", q2: "1:26.070", q3: "1:25.487", gap: "+0.383" },
  { position: 11, driverId: "george_russell", driverCode: "RUS", constructorName: "Mercedes", q1: "1:27.011", q2: "1:26.710", gap: "+1.606", eliminatedIn: "Q2" },
  { position: 16, driverId: "isack_hadjar", driverCode: "HAD", constructorName: "Red Bull Racing", q1: "1:27.492", gap: "+2.388", eliminatedIn: "Q1" }
];

export const mockLiveTiming: LiveTimingSnapshot = {
  sessionName: "British Grand Prix Qualifying",
  status: "Mock",
  lastUpdated: new Date().toISOString(),
  messages: ["Race control: Track limits monitored at Turns 9 and 15", "DRS enabled on all timed laps"],
  rows: mockQualifyingResults.slice(0, 5).map((result) => ({
    position: result.position,
    driverId: result.driverId,
    driverCode: result.driverCode,
    teamName: result.constructorName,
    gapToLeader: result.gap ?? "+0.000",
    interval: result.position === 1 ? "Leader" : "+0.064",
    lastLap: result.q3 ?? result.q2 ?? result.q1 ?? "--",
    bestLap: result.q3 ?? result.q2 ?? result.q1 ?? "--",
    sector1: "28.2",
    sector2: "31.4",
    sector3: "25.5",
    pitStops: 0,
    tyreCompound: "Soft",
    stintAge: 3,
    drs: true
  }))
};

export const mockNews: NewsArticle[] = [
  { id: "news-1", title: "Ferrari edges Red Bull in late qualifying simulation", source: "Apex Wire", publishedAt: `${season}-07-04T09:30:00Z`, summary: "Ferrari's low-fuel pace looked sharp in final practice, setting up a tight fight for pole.", url: "https://example.com/ferrari-qualifying-sim", imageUrl: "/track-placeholder.svg", category: "team" },
  { id: "news-2", title: "McLaren brings revised floor for high-speed corners", source: "Pit Lane Review", publishedAt: `${season}-07-03T18:10:00Z`, summary: "The team says the upgrade is aimed at stability through long-radius entries.", url: "https://example.com/mclaren-floor", imageUrl: "/track-placeholder.svg", category: "technical" },
  { id: "news-3", title: "Race control confirms revised track limits guidance", source: "Grand Prix Desk", publishedAt: `${season}-07-03T12:00:00Z`, summary: "Officials will pay special attention to exits where lap deletions affected last year's event.", url: "https://example.com/track-limits", imageUrl: "/track-placeholder.svg", category: "race" }
];

export const mockInsights: RaceInsight[] = [
  { id: "pace", title: "Fastest Lap Trend", type: "line", description: "Representative mock lap samples show the top three converging as fuel burns off.", data: [{ lap: 1, VER: 87.9, LEC: 88.1, NOR: 88.2 }, { lap: 5, VER: 87.1, LEC: 86.9, NOR: 87.0 }, { lap: 10, VER: 86.8, LEC: 86.6, NOR: 86.7 }] },
  { id: "tyres", title: "Tyre Stint Comparison", type: "bar", description: "Soft runs are fastest over one lap, while medium stints keep a steadier spread.", data: [{ compound: "Soft", average: 86.7 }, { compound: "Medium", average: 88.3 }, { compound: "Hard", average: 89.1 }] },
  { id: "control", title: "Race Control Timeline", type: "timeline", description: "Messages are surfaced when OpenF1 race-control data is available.", data: [{ time: "14:02", event: "DRS enabled" }, { time: "14:18", event: "Track limits noted" }] },
  { id: "weather", title: "Weather Impact", type: "placeholder", description: "Connect OpenF1 weather samples to compare track temperature against lap-time drift.", data: [] }
];
