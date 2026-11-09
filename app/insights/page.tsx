import { InsightCard } from "@/components/InsightCard";
import { PageHeader } from "@/components/PageHeader";
import { getDriverStandings, getConstructorStandings, type RaceInsight } from "@/lib/api";

export default async function InsightsPage() {
  const [drivers, teams] = await Promise.all([getDriverStandings(), getConstructorStandings()]);
  const insights: RaceInsight[] = [
    { id: "driver-points", title: "Driver championship points", description: "Latest published championship classification", type: "bar", data: drivers.slice(0, 10).map((row) => ({ label: row.name.split(" ").at(-1) ?? row.name, value: row.points })) },
    { id: "team-points", title: "Constructor championship points", description: "Latest published championship classification", type: "bar", data: teams.map((row) => ({ label: row.name, value: row.points })) }
  ];
  return (
    <>
      <PageHeader title="Race Insights" eyebrow="Analytics">
        <span className="data-chip">Jolpica standings</span>
      </PageHeader>
      <div className="grid gap-4 xl:grid-cols-2">
        {insights.map((insight) => <InsightCard key={insight.id} insight={insight} />)}
      </div>
    </>
  );
}
