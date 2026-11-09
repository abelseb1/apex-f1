import type { RaceInsight } from "@/lib/api";
import { Panel } from "./Panel";
import { ChartCard } from "./ChartCard";

export function InsightCard({ insight }: { insight: RaceInsight }) {
  return (
    <Panel>
      <h3 className="text-lg font-black">{insight.title}</h3>
      <p className="mt-2 text-sm text-white/62">{insight.description}</p>
      <div className="mt-4">
        <ChartCard insight={insight} />
      </div>
    </Panel>
  );
}
