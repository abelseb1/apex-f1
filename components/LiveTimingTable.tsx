import type { LiveTimingRow } from "@/lib/api";
import type { CSSProperties } from "react";

const compoundStyles: Record<string, string> = {
  SOFT: "border-[#ff2f45] bg-[#ff2f45]/14 text-[#ff6172]",
  MEDIUM: "border-[#ffd433] bg-[#ffd433]/14 text-[#ffe16b]",
  HARD: "border-white/70 bg-white/10 text-white",
  INTERMEDIATE: "border-[#38d978] bg-[#38d978]/14 text-[#6df0a0]",
  WET: "border-[#3a91ff] bg-[#3a91ff]/14 text-[#7bb6ff]"
};

function compoundClass(compound?: string): string {
  const key = compound?.toUpperCase() ?? "";
  return compoundStyles[key] ?? "border-white/20 bg-white/[0.08] text-white/70";
}

function compoundLetter(compound?: string): string {
  return compound?.slice(0, 1).toUpperCase() ?? "-";
}

function accentStyle(colour?: string): CSSProperties {
  return { backgroundColor: colour ?? "#5ff2ba" };
}

export function LiveTimingTable({ rows }: { rows: LiveTimingRow[] }) {
  return (
    <div className="table-scroll border border-white/10 bg-black">
      <table className="timing-table w-full border-separate border-spacing-0 text-left text-sm" aria-label="Formula 1 timing rows">
        <thead>
          <tr className="text-[0.68rem] uppercase tracking-[0.16em] text-white/50">
            {["Pos", "Driver", "Team", "Gap", "Int", "Last", "Best", "S1", "S2", "S3", "Tyre", "Pit"].map((heading) => (
              <th key={heading} className="border-b border-white/10 px-4 py-3 font-black">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.position}-${row.driverId}`}
              className="bg-[#0d0e14] text-white odd:bg-[#13151d] hover:bg-[#1b1f2a]"
            >
              <td className="border-b border-white/[0.08] px-4 py-3 font-black tabular-nums text-white/70">
                {row.position > 0 ? String(row.position).padStart(2, "0") : "--"}
              </td>
              <td className="border-b border-white/[0.08] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-10 w-1 shrink-0 rounded-full" style={accentStyle(row.teamColour)} aria-hidden />
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black leading-none text-white">{row.driverCode}</span>
                      {row.driverNumber ? (
                        <span className="text-xs font-black tabular-nums text-white/[0.38]">#{row.driverNumber}</span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-xs font-bold text-white/[0.54]">{row.driverName ?? "Driver"}</p>
                  </div>
                </div>
              </td>
              <td className="border-b border-white/[0.08] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_18px_rgba(95,242,186,0.28)]" style={accentStyle(row.teamColour)} aria-hidden />
                  <span className="font-black text-white/[0.86]">{row.teamName}</span>
                </div>
              </td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-black tabular-nums text-white">{row.gapToLeader}</td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-black tabular-nums text-mint">{row.interval}</td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-bold tabular-nums text-white/[0.78]">{row.lastLap}</td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-black tabular-nums text-white">{row.bestLap}</td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-bold tabular-nums text-white/[0.62]">{row.sector1 ?? "--"}</td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-bold tabular-nums text-white/[0.62]">{row.sector2 ?? "--"}</td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-bold tabular-nums text-white/[0.62]">{row.sector3 ?? "--"}</td>
              <td className="border-b border-white/[0.08] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black ${compoundClass(row.tyreCompound)}`}>
                    {compoundLetter(row.tyreCompound)}
                  </span>
                  <span className="font-black tabular-nums text-white/[0.74]">{row.stintAge ?? "--"}</span>
                </div>
              </td>
              <td className="border-b border-white/[0.08] px-4 py-3 font-black tabular-nums text-white/[0.72]">{row.pitStops ?? "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
