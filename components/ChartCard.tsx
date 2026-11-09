"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RaceInsight } from "@/lib/api";
import { EmptyState } from "./EmptyState";

export function ChartCard({ insight }: { insight: RaceInsight }) {
  if (insight.type === "placeholder" || insight.data.length === 0) {
    return <EmptyState title="Data unavailable" message="Please try again shortly." />;
  }

  if (insight.type === "bar") {
    return (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={insight.data}>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.55)" />
            <YAxis stroke="rgba(255,255,255,0.55)" />
            <Tooltip contentStyle={{ background: "#11151d", border: "1px solid rgba(255,255,255,0.12)" }} />
            <Bar dataKey="value" name="Points" fill="#ff2746" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (insight.type === "timeline") {
    return (
      <ol className="space-y-3">
        {insight.data.map((item, index) => (
          <li key={index} className="rounded-md border border-line bg-white/5 p-3 text-sm">
            <b>{String(item.time)}</b> <span className="text-white/62">{String(item.event)}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={insight.data}>
          <CartesianGrid stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="lap" stroke="rgba(255,255,255,0.55)" />
          <YAxis stroke="rgba(255,255,255,0.55)" />
          <Tooltip contentStyle={{ background: "#11151d", border: "1px solid rgba(255,255,255,0.12)" }} />
          <Line type="monotone" dataKey="VER" stroke="#ff2746" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="LEC" stroke="#f6d84a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="NOR" stroke="#5ff2ba" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
