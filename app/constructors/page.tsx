import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CarSilhouette, TeamLogo } from "@/components/F1Visuals";
import { PageHeader } from "@/components/PageHeader";
import { getConstructors } from "@/lib/api";
import { teamStyle } from "@/lib/ui/f1Style";

export const revalidate = 120;

export default async function ConstructorsPage() {
  const constructors = await getConstructors();
  const rankedTeams = [...constructors].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

  return (
    <>
      <PageHeader title="F1 Teams 2026" eyebrow="Constructors championship">
        <span className="data-chip">{constructors.length} teams</span>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rankedTeams.map((team, index) => {
          const style = teamStyle(team.name);
          return (
            <Link
              key={team.id}
              href={`/constructors/${team.id}`}
              aria-label={`View ${team.name} constructor profile`}
              className="group relative block overflow-hidden rounded-md border border-white/10 bg-[#111218] shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-apex"
            >
              <div className="speed-lines relative min-h-[260px] p-5" style={{ background: `linear-gradient(135deg, ${style.secondary} 0%, #0a0b10 72%)` }}>
                <div className="relative z-10 flex items-start justify-between gap-3 text-white">
                  <div className="flex min-w-0 items-center gap-3">
                    <TeamLogo name={team.name} className="h-10 w-10 shrink-0" />
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black uppercase leading-tight">{team.name}</h2>
                      <p className="mt-1 truncate text-xs font-bold text-white/46">{team.drivers.join(" / ")} / {team.nationality}</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black tabular-nums text-white/18">P{index + 1}</span>
                </div>
                <div className="relative z-10 mt-7 h-36">
                  {team.carImageUrl ? (
                    <Image src={team.carImageUrl} alt={`${team.name} 2026 car`} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain drop-shadow-[0_26px_24px_rgba(0,0,0,0.68)] transition duration-500 group-hover:scale-[1.045]" priority={index < 3} />
                  ) : <CarSilhouette teamName={team.name} className="h-full w-full" />}
                </div>
              </div>
              <div className="grid grid-cols-[repeat(3,1fr)_auto] border-t border-white/[0.08]">
                {[["Points", team.points], ["Wins", team.wins], ["Podiums", team.podiums]].map(([label, value]) => (
                  <div key={label} className="border-r border-white/[0.08] px-3 py-3 text-center">
                    <p className="text-lg font-black tabular-nums text-white">{value ?? 0}</p>
                    <p className="mt-0.5 text-[0.6rem] font-black uppercase text-white/36">{label}</p>
                  </div>
                ))}
                <span className="flex items-center justify-center px-4 text-white/42 transition group-hover:text-white" aria-hidden><ArrowUpRight className="h-4 w-4" /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
