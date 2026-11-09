import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Race } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";

export function RaceCard({ race }: { race: Race }) {
  return (
    <Link href={`/calendar/${race.id}`} className="glass block rounded-lg p-4 transition hover:border-apex/50 hover:bg-white/8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase text-white/45">Round {race.round}</p>
          <h3 className="mt-1 text-xl font-black">{race.raceName}</h3>
        </div>
        <StatusBadge status={race.status} />
      </div>
      <p className="mt-4 flex items-center gap-2 text-sm text-white/65">
        <MapPin className="h-4 w-4 text-apex" aria-hidden />
        {race.circuit.name}, {race.circuit.country}
      </p>
      <p className="mt-2 text-sm text-white/50">{new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "short" }).format(new Date(race.raceDate))}</p>
    </Link>
  );
}
