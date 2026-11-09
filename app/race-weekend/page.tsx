import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { SessionSchedule } from "@/components/SessionSchedule";
import { getCalendar } from "@/lib/api";

export default async function RaceWeekendPage() {
  const calendar = await getCalendar();
  const race = calendar.find((item) => item.status !== "completed") ?? calendar[0];
  if (!race) return <PageHeader title="Schedule unavailable" eyebrow="Please try again shortly" />;

  return (
    <>
      <PageHeader title="Race Weekend" eyebrow={race.grandPrix} />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="h-72 rounded-lg border border-line bg-[url('/track-placeholder.svg')] bg-cover bg-center" />
          <h2 className="mt-4 text-2xl font-black">{race.raceName}</h2>
          <p className="mt-2 text-white/65">{race.circuit.name} · {race.circuit.city}, {race.circuit.country}</p>
          <p className="mt-1 text-sm text-white/50">{new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(new Date(race.raceDate))}</p>
        </Panel>
        <Panel>
          <h2 className="mb-4 text-xl font-black">Local session schedule</h2>
          <SessionSchedule sessions={race.sessions} />
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-black">Weather preview</h2>
          <p className="mt-2 text-white/62">Weather data will appear here when the OpenF1 weather endpoint has samples for the active session.</p>
        </Panel>
        <Panel>
          <h2 className="text-xl font-black">Historical winners</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(race.historicalWinners ?? []).map((winner) => <span key={winner} className="rounded-full bg-white/8 px-3 py-1 text-sm">{winner}</span>)}
          </div>
        </Panel>
      </div>
    </>
  );
}
