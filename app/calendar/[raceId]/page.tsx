import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, CloudSun, Flag } from "lucide-react";
import { notFound } from "next/navigation";
import { CountdownTimer } from "@/components/CountdownTimer";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { SessionSchedule } from "@/components/SessionSchedule";
import { StatusBadge } from "@/components/StatusBadge";
import { getCalendar } from "@/lib/api";

export default async function RaceDetailPage({ params }: { params: Promise<{ raceId: string }> }) {
  const { raceId } = await params;
  const race = (await getCalendar()).find((item) => item.id === raceId);
  if (!race) notFound();
  const nextSession = race.sessions.find((session) => session.status !== "completed");
  const completedSessions = race.sessions.filter((session) => session.status === "completed").length;
  const dataMode = race.sessions.length > 0 ? "Provider schedule" : "Partial provider data";

  return (
    <>
      <PageHeader title={race.raceName} eyebrow={`Round ${race.round}`}>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/calendar" className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-bold text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Calendar
          </Link>
          <StatusBadge status={race.status} />
        </div>
      </PageHeader>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Panel className="p-4 sm:p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-apex/30 bg-apex/[0.12] text-apex"><Clock3 className="h-5 w-5" aria-hidden /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">Next Session</p>
              <p className="text-lg font-black">{nextSession?.type ?? "Schedule pending"}</p>
            </div>
          </div>
        </Panel>
        <Panel className="p-4 sm:p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-mint/30 bg-mint/[0.12] text-mint"><CalendarDays className="h-5 w-5" aria-hidden /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">Race Date</p>
              <p className="text-lg font-black">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(race.raceDate))}</p>
            </div>
          </div>
        </Panel>
        <Panel className="p-4 sm:p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-signal/30 bg-signal/[0.12] text-signal"><Flag className="h-5 w-5" aria-hidden /></span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">Data Status</p>
              <p className="text-lg font-black">{dataMode}</p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="h-72 rounded-md border border-line bg-[url('/track-placeholder.svg')] bg-cover bg-center" />
          <h2 className="mt-4 text-xl font-black">{race.circuit.name}</h2>
          <p className="mt-2 text-white/62">{race.circuit.city}, {race.circuit.country}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={`/qualifying?year=${race.season}&round=${race.round}`} className="rounded-md border border-white/10 bg-white/[0.07] px-3 py-2 text-sm font-bold text-white/70 hover:text-white">Qualifying</Link>
            <Link href="/live-timing" className="rounded-md border border-apex/30 bg-apex/[0.12] px-3 py-2 text-sm font-bold text-apex">Live Timing</Link>
          </div>
        </Panel>
        <Panel>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-apex">Weekend Plan</p>
              <h2 className="mt-1 text-xl font-black">Sessions</h2>
            </div>
            <span className="rounded border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black uppercase text-white/55">{completedSessions}/{race.sessions.length || "--"} done</span>
          </div>
          <SessionSchedule sessions={race.sessions} />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-black">Countdown</h2>
          {nextSession ? (
            <>
              <p className="mt-2 text-sm text-white/62">{nextSession.type} starts in your local timezone.</p>
              <div className="mt-4">
                <CountdownTimer target={nextSession.startsAt} />
              </div>
            </>
          ) : (
            <p className="mt-2 text-white/62">Every scheduled session for this Grand Prix is marked complete.</p>
          )}
        </Panel>
        <Panel>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-mint/30 bg-mint/[0.12] text-mint"><CloudSun className="h-5 w-5" aria-hidden /></span>
            <div>
              <h2 className="text-xl font-black">Track Conditions</h2>
              <p className="mt-1 text-sm text-white/62">No verified weather sample is available for this session.</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
