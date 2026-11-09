import type { Standing } from "@/lib/api";

export function StandingsTable({ standings, label, entityLabel = "Driver" }: { standings: Standing[]; label: string; entityLabel?: string }) {
  return (
    <div className="table-scroll">
      <table className="w-full border-separate border-spacing-0 text-left text-sm" aria-label={label}>
        <thead className="text-[11px] uppercase text-white/55">
          <tr>
            <th className="border-b border-white/20 px-3 py-4 font-black">Pos.</th>
            <th className="border-b border-white/20 px-3 py-4 font-black">{entityLabel}</th>
            <th className="border-b border-white/20 px-3 py-4 font-black">Points</th>
            <th className="border-b border-white/20 px-3 py-4 font-black">Wins</th>
            <th className="border-b border-white/20 px-3 py-4 font-black">Podiums</th>
            <th className="border-b border-white/20 px-3 py-4 font-black">Change</th>
          </tr>
        </thead>
        <tbody>
          {!standings.length ? <tr><td colSpan={6} className="px-3 py-8 text-white/60">Standings are unavailable for this season. Please try again shortly.</td></tr> : null}
          {standings.map((row) => (
          <tr key={row.entityId} className="transition hover:bg-white/[0.035]">
              <td className="border-b border-white/[0.09] px-3 py-4 text-lg font-black tabular-nums text-white/28">{String(row.position).padStart(2, "0")}</td>
              <td className="border-b border-white/[0.09] px-3 py-4 font-black text-white">{row.name}</td>
              <td className="border-b border-white/[0.09] px-3 py-4 font-black tabular-nums text-right text-white sm:text-left">{row.points}</td>
              <td className="border-b border-white/[0.09] px-3 py-4 font-bold tabular-nums text-white/62">{row.wins}</td>
              <td className="border-b border-white/[0.09] px-3 py-4 font-bold tabular-nums text-white/62">{row.podiums ?? "--"}</td>
              <td className={`border-b border-white/[0.09] px-3 py-4 font-bold tabular-nums ${row.positionChange === undefined || row.positionChange === 0 ? "text-white/34" : row.positionChange > 0 ? "text-mint" : "text-[#ff5a52]"}`}>{row.positionChange === undefined ? "--" : row.positionChange > 0 ? `+${row.positionChange}` : row.positionChange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
