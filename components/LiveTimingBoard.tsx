"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Activity, Clock3, Flag, Gauge, Radio, RefreshCw } from "lucide-react";
import { LiveTimingTable } from "@/components/LiveTimingTable";
import type { LiveTimingRow, LiveTimingSnapshot } from "@/lib/api";

function statusClass(status: LiveTimingSnapshot["status"]): string {
  if (status === "Live") return "border-apex bg-apex text-white shadow-[0_0_28px_rgba(225,6,0,0.28)]";
  if (status === "Historical") return "border-signal/60 bg-signal/[0.12] text-signal";
  if (status === "Mock") return "border-white/20 bg-white/10 text-white/70";
  return "border-white/20 bg-white/[0.06] text-white/70";
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function parseLapTime(value: string): number {
  const [minutes, seconds] = value.split(":");
  if (!seconds) return Number.POSITIVE_INFINITY;

  const parsed = Number(minutes) * 60 + Number(seconds);
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY;
}

function fastestRow(rows: LiveTimingRow[]): LiveTimingRow | undefined {
  return rows
    .filter((row) => row.bestLap !== "--")
    .sort((a, b) => parseLapTime(a.bestLap) - parseLapTime(b.bestLap))[0];
}

export function LiveTimingBoard({ initialSnapshot }: { initialSnapshot: LiveTimingSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshing = useRef(false);

  const leader = snapshot.rows[0];
  const fastest = useMemo(() => fastestRow(snapshot.rows), [snapshot.rows]);
  const refreshIntervalMs = 60_000;

  const refresh = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/live-timing", { cache: "no-store", signal: AbortSignal.timeout(45_000) });
      if (!response.ok) throw new Error("Timing feed did not respond.");
      const nextSnapshot = await response.json() as LiveTimingSnapshot;
      setSnapshot(nextSnapshot);
      setError(null);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Timing refresh failed.");
    } finally {
      refreshing.current = false;
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(refresh, refreshIntervalMs);
    return () => window.clearInterval(interval);
  }, [refresh, refreshIntervalMs]);

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-md border border-white/10 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.42)]">
        <div className="border-b border-white/10 bg-[#111218] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-2 rounded border px-3 py-1 text-xs font-black uppercase ${statusClass(snapshot.status)}`}>
                  <Activity className="h-3.5 w-3.5" aria-hidden />
                  {snapshot.status}
                </span>
                <span className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black uppercase text-white/60">
                  <Radio className="h-3.5 w-3.5" aria-hidden />
                  {snapshot.source ?? "Timing feed"}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-black uppercase leading-none text-white sm:text-5xl">
                {snapshot.sessionName}
              </h1>
              <p className="mt-3 max-w-3xl text-sm font-semibold text-white/[0.56]">
                {[snapshot.meetingName, snapshot.circuitName, snapshot.countryName].filter(Boolean).join(" / ")}
              </p>
              {snapshot.sessionDate ? <p className="mt-2 text-xs text-white/55">Session: {new Date(snapshot.sessionDate).toLocaleDateString("en-GB", { dateStyle: "long", timeZone: "UTC" })}</p> : null}
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-right">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/40">Last checked</p>
                <p className="mt-1 text-lg font-black tabular-nums text-white">{formatTime(snapshot.lastUpdated)}</p>
              </div>
              <button
                type="button"
                onClick={refresh}
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-white/[0.12] bg-white/[0.06] text-white transition hover:border-mint/60 hover:text-mint disabled:cursor-progress disabled:opacity-60"
                aria-label="Refresh timing"
                title="Refresh timing"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        <div className="grid border-b border-white/10 bg-[#101119] sm:grid-cols-3">
          <div className="border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r sm:px-7">
            <p className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/[0.42]">
              <Flag className="h-4 w-4" aria-hidden />
              Leader
            </p>
            <p className="mt-2 text-2xl font-black text-white">{leader ? `${leader.driverCode} ${leader.gapToLeader}` : "--"}</p>
            <p className="mt-1 text-xs font-bold text-white/[0.44]">{leader?.teamName ?? "Awaiting timing rows"}</p>
          </div>
          <div className="border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r sm:px-7">
            <p className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/[0.42]">
              <Gauge className="h-4 w-4" aria-hidden />
              Best Lap
            </p>
            <p className="mt-2 text-2xl font-black tabular-nums text-white">{fastest?.bestLap ?? "--"}</p>
            <p className="mt-1 text-xs font-bold text-white/[0.44]">{fastest ? `${fastest.driverCode} / ${fastest.teamName}` : "No lap data yet"}</p>
          </div>
          <div className="px-5 py-4 sm:px-7">
            <p className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/[0.42]">
              <Clock3 className="h-4 w-4" aria-hidden />
              Field
            </p>
            <p className="mt-2 text-2xl font-black tabular-nums text-white">{snapshot.rows.length}</p>
            <p className="mt-1 text-xs font-bold text-white/[0.44]">Auto-refresh every {refreshIntervalMs / 1000}s</p>
          </div>
        </div>

        {snapshot.rows.length ? <LiveTimingTable rows={snapshot.rows} /> : <p className="p-8 text-white/60">Timing is temporarily unavailable. Automatic refresh is active.</p>}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_0.42fr]">
        <div className="border border-white/10 bg-[#0d0e14] p-4">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/[0.42]">Race Control</p>
          <div className="mt-3 grid gap-2">
            {snapshot.messages.map((message) => (
              <p key={message} className="border-l-2 border-apex bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/[0.72]">
                {message}
              </p>
            ))}
          </div>
        </div>
        <div className="border border-white/10 bg-[#0d0e14] p-4">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/[0.42]">Feed Health</p>
          <p className="mt-3 text-sm font-bold text-white/70">
            {error ?? (snapshot.source?.includes("saved snapshot") ? "Provider refresh delayed. Last verified session is shown with its original timestamp." : isRefreshing
              ? "Refreshing timing feed."
              : snapshot.status === "Live"
                ? "Authenticated live timing is connected."
                : snapshot.status === "Historical"
                  ? "Verified latest classification is connected."
                  : snapshot.status === "Mock" || snapshot.status === "Unavailable"
                    ? "Both providers are currently unavailable."
                    : "Waiting for the next active session.")}
          </p>
        </div>
      </div>
    </section>
  );
}
