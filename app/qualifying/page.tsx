import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { QualifyingResults } from "@/components/QualifyingResults";
import { getCalendar, getQualifyingResults } from "@/lib/api";

export default async function QualifyingPage({ searchParams }: { searchParams: Promise<{ year?: string; round?: string }> }) {
  const { year, round } = await searchParams;
  const season = Number(year) || new Date().getUTCFullYear();
  const [calendar, results] = await Promise.all([getCalendar(season), getQualifyingResults(season, round ?? "last")]);
  const selectedRound = round ?? "last";
  const eliminatedQ1 = results.filter((row) => row.eliminatedIn === "Q1");
  const eliminatedQ2 = results.filter((row) => row.eliminatedIn === "Q2");

  return (
    <>
      <PageHeader title="Qualifying" eyebrow="Q1 / Q2 / Q3">
        <form className="flex flex-wrap items-center gap-2">
          <input name="year" defaultValue={season} className="w-24 rounded border border-line bg-white/[0.06] px-3 py-2 text-sm" aria-label="Year" />
          <select name="round" defaultValue={selectedRound} className="rounded border border-line bg-graphite px-3 py-2 text-sm" aria-label="Grand Prix">
            <option value="last">Latest Grand Prix</option>
            {calendar.map((race) => <option key={race.id} value={race.round}>{race.raceName}</option>)}
          </select>
          <button className="rounded bg-apex px-4 py-2 text-sm font-black uppercase">Load</button>
        </form>
      </PageHeader>
      <Panel>
        <div className="mb-5 grid border-y border-white/[0.08] md:grid-cols-3">
          <div className="border-b border-white/[0.08] p-4 md:border-b-0 md:border-r">
            <p className="text-xs font-black uppercase text-white/38">Q1 eliminated</p>
            <p className="mt-2 font-black">{eliminatedQ1.map((result) => result.driverCode).join(", ") || "Pending"}</p>
          </div>
          <div className="border-b border-white/[0.08] p-4 md:border-b-0 md:border-r">
            <p className="text-xs font-black uppercase text-white/38">Q2 eliminated</p>
            <p className="mt-2 font-black">{eliminatedQ2.map((result) => result.driverCode).join(", ") || "Pending"}</p>
          </div>
          <div className="p-4">
            <p className="text-xs font-black uppercase text-white/38">Best lap</p>
            <p className="mt-2 font-black tabular-nums text-mint">{results[0]?.q3 ?? results[0]?.q2 ?? results[0]?.q1 ?? "--"}</p>
          </div>
        </div>
        <QualifyingResults results={results} />
      </Panel>
    </>
  );
}
