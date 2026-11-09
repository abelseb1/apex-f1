import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Radio, Timer, Trophy } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { TeamLogo } from "@/components/F1Visuals";
import { Panel } from "@/components/Panel";
import { StandingsTable } from "@/components/StandingsTable";
import { getCalendar, getConstructors, getDriverStandings, getDrivers, type Driver, type Standing } from "@/lib/api";
import { teamStyle } from "@/lib/ui/f1Style";

export const revalidate = 120;

const driverAliases: Record<string, string> = {
  "andrea kimi antonelli": "kimi antonelli"
};

function keyFor(value?: string) {
  const key = (value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return driverAliases[key] ?? key;
}

function driverKeys(driver: Driver) {
  const fullName = `${driver.givenName} ${driver.familyName}`;
  return [driver.id, driver.code, fullName, driver.familyName, driver.permanentNumber]
    .filter(Boolean)
    .map((value) => keyFor(String(value)));
}

function PodiumCard({ row, driver, featured }: { row: Standing; driver?: Driver; featured: boolean }) {
  const fullName = driver ? `${driver.givenName} ${driver.familyName}` : row.name;
  const team = driver?.constructorName ?? "Formula 1";
  const style = teamStyle(team);

  return (
    <article
      className={`group overflow-hidden rounded-md border border-white/10 bg-[#101116] shadow-[0_22px_70px_rgba(0,0,0,0.34)] transition duration-300 hover:-translate-y-1 hover:border-white/25 ${featured ? "lg:-translate-y-3" : ""}`}
      style={{ borderTopColor: style.primary }}
    >
      <div className="relative aspect-[682/461] overflow-hidden bg-black">
        {driver?.headshotUrl ? (
          <Image
            src={driver.headshotUrl}
            alt={`${fullName}, ${team}`}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.018]"
            priority={row.position <= 3}
          />
        ) : (
          <div className="speed-lines h-full w-full" style={{ backgroundColor: style.secondary }} />
        )}
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-white/[0.08] p-4">
        <span className="text-3xl font-black tabular-nums text-white/24">{String(row.position).padStart(2, "0")}</span>
        <div className="min-w-0 border-l border-white/10 pl-3">
          <p className="truncate text-sm font-black uppercase text-white">{fullName}</p>
          <p className="mt-1 truncate text-xs font-bold text-white/44">{team}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black tabular-nums text-white">{row.points}</p>
          <p className="text-[0.65rem] font-black uppercase text-white/38">Points</p>
        </div>
      </div>
    </article>
  );
}

export default async function DashboardPage() {
  const season = new Date().getUTCFullYear();
  const [calendar, standings, drivers, constructors] = await Promise.all([
    getCalendar(season),
    getDriverStandings(season),
    getDrivers(season),
    getConstructors(season)
  ]);

  const upcoming = calendar.find((race) => race.status !== "completed");
  const nextSession = upcoming?.sessions.find((session) => session.status !== "completed");
  const driverByKey = new Map<string, Driver>();
  for (const driver of drivers) {
    for (const key of driverKeys(driver)) driverByKey.set(key, driver);
  }

  const leader = standings[0];
  const leaderDriver = leader ? driverByKey.get(keyFor(leader.name)) ?? driverByKey.get(keyFor(leader.entityId)) : undefined;
  const leadTeam = constructors.find((team) => team.id === leaderDriver?.constructorId) ?? [...constructors].sort((a, b) => (b.points ?? 0) - (a.points ?? 0))[0];
  const heroStyle = teamStyle(leadTeam?.name);
  const topThree = [standings[1], standings[0], standings[2]].filter(Boolean);
  const topTeams = [...constructors].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)).slice(0, 3);

  return (
    <>
      <section
        className="relative mb-14 min-h-[410px] overflow-hidden rounded-md border border-white/10 bg-[#111218] shadow-[0_28px_90px_rgba(0,0,0,0.42)]"
        style={{ background: `linear-gradient(105deg, ${heroStyle.secondary} 0%, #111218 48%, #08090d 100%)` }}
      >
        <div className="speed-lines absolute inset-0 opacity-35" aria-hidden />
        {leadTeam?.carImageUrl ? (
          <div className="absolute inset-x-0 bottom-2 h-[44%] sm:inset-x-auto sm:bottom-8 sm:right-4 sm:h-[58%] sm:w-[58%] lg:right-8 lg:w-[62%]">
            <Image
              src={leadTeam.carImageUrl}
              alt={`${leadTeam.name} Formula 1 car`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain object-bottom drop-shadow-[0_34px_28px_rgba(0,0,0,0.72)]"
              priority
            />
          </div>
        ) : null}
        <div className="relative z-10 flex min-h-[410px] max-w-2xl flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="data-chip"><span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden /> Standings / 2 min</span>
              <span className="data-chip">Season {season}</span>
            </div>
            <p className="eyebrow mt-9">Championship race centre</p>
            <h1 className="mt-4 max-w-xl text-4xl font-black uppercase leading-[0.92] text-white sm:text-6xl">
              {season} Formula 1 Championship
            </h1>
            <p className="mt-5 max-w-lg text-sm font-semibold leading-6 text-white/58 sm:text-base">
              Verified standings, every race weekend, and session timing in one focused view.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/live-timing" className="inline-flex min-h-11 items-center gap-2 rounded bg-apex px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-[#ff1e16]">
                <Radio className="h-4 w-4" aria-hidden /> Live timing
              </Link>
              <Link href="/calendar" className="inline-flex min-h-11 items-center gap-2 rounded border border-white/20 bg-black/20 px-5 py-3 text-sm font-black uppercase text-white transition hover:border-white/45">
                Race calendar <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="mt-10 flex w-fit items-center gap-3 rounded bg-black/55 px-3 py-2 text-xs font-bold text-white/60 backdrop-blur-sm">
            <Trophy className="h-4 w-4 text-signal" aria-hidden />
            Championship leader: <span className="font-black text-white">{leader?.name ?? "Pending"}</span>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Drivers championship</p>
            <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">The front three</h2>
          </div>
          <Link href="/standings" className="hidden items-center gap-2 text-xs font-black uppercase text-white/58 transition hover:text-white sm:inline-flex">
            Full standings <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid items-end gap-4 md:grid-cols-3">
          {topThree.map((row) => (
            <PodiumCard
              key={row.entityId}
              row={row}
              driver={driverByKey.get(keyFor(row.name)) ?? driverByKey.get(keyFor(row.entityId))}
              featured={row.position === 1}
            />
          ))}
        </div>
      </section>

      <div className="mb-14 grid gap-5 xl:grid-cols-[1.28fr_0.72fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Championship order</p>
              <h2 className="mt-3 text-2xl font-black uppercase">Driver standings</h2>
            </div>
            <span className="data-chip hidden sm:inline-flex">2 min refresh</span>
          </div>
          <StandingsTable standings={standings.slice(0, 8)} label="Top driver standings" />
        </Panel>

        <Panel className="overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Up next</p>
              <h2 className="mt-3 text-2xl font-black uppercase text-white">{upcoming?.raceName ?? "Next Grand Prix"}</h2>
              <p className="mt-2 text-sm font-semibold text-white/48">{upcoming ? `${upcoming.circuit.name}, ${upcoming.circuit.country}` : "Schedule pending"}</p>
            </div>
            <CalendarDays className="h-6 w-6 shrink-0 text-apex" aria-hidden />
          </div>
          {nextSession ? (
            <>
              <div className="mt-7 flex items-center justify-between border-y border-white/[0.08] py-4 text-sm">
                <span className="flex items-center gap-2 font-black text-white"><Timer className="h-4 w-4 text-mint" aria-hidden /> {nextSession.type}</span>
                <time className="font-bold text-white/48" dateTime={nextSession.startsAt}>
                  {new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(nextSession.startsAt))}
                </time>
              </div>
              <div className="mt-5"><CountdownTimer target={nextSession.startsAt} /></div>
            </>
          ) : null}
          <Link href={upcoming ? `/calendar/${upcoming.id}` : "/calendar"} className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase text-white/62 hover:text-white">
            Weekend schedule <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </Panel>
      </div>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Constructors championship</p>
            <h2 className="mt-3 text-3xl font-black uppercase">Leading teams</h2>
          </div>
          <Link href="/constructors" className="hidden items-center gap-2 text-xs font-black uppercase text-white/58 hover:text-white sm:inline-flex">
            All teams <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {topTeams.map((team, index) => {
            const style = teamStyle(team.name);
            return (
              <Link key={team.id} href={`/constructors/${team.id}`} className="group overflow-hidden rounded-md border border-white/10 bg-[#111218] transition hover:-translate-y-1 hover:border-white/25">
                <div className="flex items-center justify-between gap-3 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamLogo name={team.name} className="h-9 w-9 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate font-black uppercase text-white">{team.name}</p>
                      <p className="mt-1 text-xs font-bold text-white/42">P{index + 1} / {team.nationality}</p>
                    </div>
                  </div>
                  <p className="text-right text-2xl font-black tabular-nums" style={{ color: style.primary }}>{team.points ?? 0}</p>
                </div>
                <div className="relative h-32 border-t border-white/[0.06] bg-black/25">
                  {team.carImageUrl ? <Image src={team.carImageUrl} alt={`${team.name} Formula 1 car`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-contain p-3 transition duration-500 group-hover:scale-[1.04]" /> : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
