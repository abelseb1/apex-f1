import { DriverPhoto } from "./DriverPhoto";
import type { Driver } from "@/lib/api";
import { DriverPortrait, TeamLogo } from "./F1Visuals";
import { Panel } from "./Panel";

export function DriverProfileHeader({ driver }: { driver: Driver }) {
  const fullName = `${driver.givenName} ${driver.familyName}`;

  return (
    <Panel className="overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,520px)_1fr] lg:items-center">
        {driver.headshotUrl ? (
          <div className="relative aspect-[682/461] overflow-hidden rounded-md border border-white/10 bg-black">
            <DriverPhoto
              driver={driver}
              sizes="(min-width: 1024px) 520px, 100vw"
              priority
            />
          </div>
        ) : (
          <DriverPortrait name={fullName} code={driver.code} teamName={driver.constructorName} className="h-36 w-24 shrink-0" />
        )}
        <div className="flex-1">
          <p className="flex items-center gap-2 text-sm font-bold uppercase text-white/50">
            <TeamLogo name={driver.constructorName} className="h-5 w-5" />
            #{driver.permanentNumber ?? "--"} - {driver.nationality}
          </p>
          <h1 className="mt-1 text-3xl font-black">{fullName}</h1>
          <p className="mt-2 text-white/65">{driver.constructorName ?? "Team unavailable"} - Born {driver.dateOfBirth ?? "unknown"}</p>
        </div>
      </div>
    </Panel>
  );
}
