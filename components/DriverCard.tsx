import { DriverPhoto } from "./DriverPhoto";
import Link from "next/link";
import type { Driver } from "@/lib/api";
import { DriverPortrait, TeamLogo } from "./F1Visuals";

export function DriverCard({ driver, priority = false }: { driver: Driver; priority?: boolean }) {
  const fullName = `${driver.givenName} ${driver.familyName}`;

  if (driver.headshotUrl) {
    return (
      <Link
        href={`/drivers/${driver.id}`}
        aria-label={`View ${fullName} profile`}
        className="group relative block overflow-hidden rounded-md border border-white/10 bg-[#111218] shadow-[0_18px_50px_rgba(0,0,0,0.32)] transition duration-300 hover:-translate-y-1 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-apex"
      >
        <div className="relative aspect-[682/461]">
          <DriverPhoto
            driver={driver}
            sizes="(min-width: 1536px) 24vw, (min-width: 1280px) 32vw, (min-width: 768px) 48vw, 100vw"
            priority={priority}
          />
        </div>
        <div className="grid grid-cols-[auto_repeat(3,1fr)] border-t border-white/[0.08]">
          <div className="flex items-center justify-center border-r border-white/[0.08] px-3">
            <TeamLogo name={driver.constructorName} className="h-8 w-8" />
          </div>
          {[["Pts", driver.points], ["Wins", driver.wins], ["Podiums", driver.podiums]].map(([label, value]) => (
            <div key={label} className="border-r border-white/[0.08] px-2 py-3 text-center last:border-r-0">
              <p className="text-base font-black tabular-nums text-white">{value ?? "--"}</p>
              <p className="mt-0.5 text-[0.6rem] font-black uppercase text-white/36">{label}</p>
            </div>
          ))}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/drivers/${driver.id}`} className="speed-lines relative block min-h-56 overflow-hidden rounded-md border border-white/10 bg-black p-5 transition hover:-translate-y-1 hover:border-white/25">
      <div className="relative z-10 flex items-center gap-4">
        <TeamLogo name={driver.constructorName} className="h-10 w-10" />
        <div>
          <h3 className="text-lg font-black">{fullName}</h3>
          <p className="text-sm font-bold text-white/55">{driver.constructorName ?? "Team TBC"} - #{driver.permanentNumber ?? "--"}</p>
        </div>
      </div>
      <DriverPortrait name={fullName} code={driver.code} teamName={driver.constructorName} className="absolute bottom-0 right-4 h-48 w-32" />
      <div className="relative z-10 mt-20 grid max-w-[60%] grid-cols-3 gap-2 text-center text-sm">
        <span className="rounded bg-white/[0.06] p-2"><b>{driver.points ?? 0}</b><br /><small className="text-white/45">PTS</small></span>
        <span className="rounded bg-white/[0.06] p-2"><b>{driver.wins ?? 0}</b><br /><small className="text-white/45">Wins</small></span>
        <span className="rounded bg-white/[0.06] p-2"><b>{driver.podiums ?? "--"}</b><br /><small className="text-white/45">Podiums</small></span>
      </div>
    </Link>
  );
}
