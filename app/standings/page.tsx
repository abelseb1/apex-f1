import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { StandingsTable } from "@/components/StandingsTable";
import { getConstructorStandings, getDriverStandings } from "@/lib/api";

export default async function StandingsPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year } = await searchParams;
  const season = Number(year) || new Date().getUTCFullYear();
  const [drivers, constructors] = await Promise.all([getDriverStandings(season), getConstructorStandings(season)]);

  return (
    <>
      <PageHeader title="Championship Standings" eyebrow={`${season} season`}>
        <form className="flex items-center gap-2">
          <label className="text-sm text-white/55" htmlFor="year">Year</label>
          <input id="year" name="year" defaultValue={season} className="w-24 rounded-md border border-line bg-white/8 px-3 py-2 text-sm" />
        </form>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel><h2 className="mb-4 text-xl font-black uppercase">Drivers</h2><StandingsTable standings={drivers} label="Driver standings" /></Panel>
        <Panel><h2 className="mb-4 text-xl font-black uppercase">Constructors</h2><StandingsTable standings={constructors} label="Constructor standings" entityLabel="Team" /></Panel>
      </div>
    </>
  );
}
