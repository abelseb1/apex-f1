import type { QualifyingResult } from "@/lib/api";

export function QualifyingResults({ results }: { results: QualifyingResult[] }) {
  return (
    <div className="table-scroll">
      <table className="w-full border-separate border-spacing-0 text-left text-sm" aria-label="Qualifying results">
        <thead className="text-xs uppercase text-white/45">
          <tr>
            {["Pos", "Driver", "Team", "Q1", "Q2", "Q3", "Gap", "Status"].map((heading) => (
              <th key={heading} className="border-b border-line px-3 py-3">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!results.length ? <tr><td colSpan={8} className="px-3 py-8 text-white/60">No qualifying results are available for this event yet.</td></tr> : null}
          {results.map((row) => (
            <tr key={`${row.position}-${row.driverId}`} className={row.eliminatedIn ? "bg-white/[0.03] text-white/62" : "hover:bg-white/5"}>
              <td className="border-b border-line px-3 py-3 font-black tabular-nums">{row.position}</td>
              <td className="border-b border-line px-3 py-3 font-bold">{row.driverCode}</td>
              <td className="border-b border-line px-3 py-3">{row.constructorName}</td>
              <td className="border-b border-line px-3 py-3 tabular-nums">{row.q1 ?? "--"}</td>
              <td className="border-b border-line px-3 py-3 tabular-nums">{row.q2 ?? "--"}</td>
              <td className="border-b border-line px-3 py-3 tabular-nums text-mint">{row.q3 ?? "--"}</td>
              <td className="border-b border-line px-3 py-3 tabular-nums">{row.gap ?? "--"}</td>
              <td className="border-b border-line px-3 py-3">{row.eliminatedIn ? `Eliminated ${row.eliminatedIn}` : "Final shootout"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
