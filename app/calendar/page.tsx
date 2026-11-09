import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getCalendar } from "@/lib/api";
import { flagFor } from "@/lib/ui/f1Style";

function statusStyle(status: string) {
  if (status === "live") return "border-apex bg-apex/15 text-[#ff5a52]";
  if (status === "completed") return "border-white/10 bg-white/[0.04] text-white/36";
  return "border-mint/25 bg-mint/[0.08] text-mint";
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = "all" } = await searchParams;
  const calendar = await getCalendar();
  const races = calendar.filter((race) => filter === "all" || race.status === filter);
  const season = calendar[0]?.season ?? new Date().getUTCFullYear();

  return (
    <>
      <PageHeader title={`${season} Race Calendar`} eyebrow="World championship">
        <span className="data-chip">{calendar.length} rounds</span>
      </PageHeader>

      <nav className="mb-6 flex gap-7 border-b border-white/[0.08] text-xs font-black uppercase text-white/42" aria-label="Calendar filters">
        {["all", "upcoming", "completed"].map((option) => (
          <Link key={option} href={`/calendar?filter=${option}`} className={`relative pb-4 capitalize transition hover:text-white ${filter === option ? "text-white" : ""}`}>
            {option}
            <span className={`absolute inset-x-0 bottom-0 h-[3px] bg-apex ${filter === option ? "opacity-100" : "opacity-0"}`} aria-hidden />
          </Link>
        ))}
      </nav>

      <div className="table-scroll rounded-md p-3 sm:p-6">
        <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
          <thead className="text-[0.68rem] uppercase text-white/38">
            <tr>
              <th className="border-b border-white/15 px-3 py-4 font-black">Round</th>
              <th className="border-b border-white/15 px-3 py-4 font-black">Grand Prix</th>
              <th className="border-b border-white/15 px-3 py-4 font-black">Date</th>
              <th className="border-b border-white/15 px-3 py-4 font-black">Circuit</th>
              <th className="border-b border-white/15 px-3 py-4 font-black">Sessions</th>
              <th className="border-b border-white/15 px-3 py-4 text-right font-black">Status</th>
              <th className="border-b border-white/15 px-3 py-4" aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {races.map((race) => (
              <tr key={race.id} className="group bg-transparent transition hover:bg-white/[0.035]">
                <td className="border-b border-white/[0.09] px-3 py-5 text-xl font-black tabular-nums text-white/24">{String(race.round).padStart(2, "0")}</td>
                <td className="border-b border-white/[0.09] px-3 py-5 font-black">
                  <Link href={`/calendar/${race.id}`} className="inline-flex items-center gap-3 group-hover:text-white">
                    <span className="text-lg" aria-hidden>{flagFor(race.circuit.country)}</span>
                    {race.grandPrix}
                  </Link>
                </td>
                <td className="border-b border-white/[0.09] px-3 py-5 font-black tabular-nums">{new Intl.DateTimeFormat("en", { day: "2-digit", month: "short" }).format(new Date(race.raceDate))}</td>
                <td className="border-b border-white/[0.09] px-3 py-5 font-bold text-white/58">{race.circuit.name}</td>
                <td className="border-b border-white/[0.09] px-3 py-5 font-black tabular-nums">{race.sessions.length || "--"}</td>
                <td className="border-b border-white/[0.09] px-3 py-5 text-right">
                  <span className={`inline-flex rounded border px-2 py-1 text-[0.65rem] font-black uppercase ${statusStyle(race.status)}`}>{race.status}</span>
                </td>
                <td className="border-b border-white/[0.09] px-3 py-5 text-right text-white/32 transition group-hover:text-white"><ArrowUpRight className="ml-auto h-4 w-4" aria-hidden /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
