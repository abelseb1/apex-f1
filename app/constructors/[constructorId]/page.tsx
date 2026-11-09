import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CarSilhouette, TeamLogo } from "@/components/F1Visuals";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { DriverPhoto } from "@/components/DriverPhoto";
import { getConstructors, getDrivers, type Constructor, type Driver } from "@/lib/api";
import { teamStyle } from "@/lib/ui/f1Style";

function ordinal(value: number) {
  const suffix = value % 10 === 1 && value % 100 !== 11 ? "st" : value % 10 === 2 && value % 100 !== 12 ? "nd" : value % 10 === 3 && value % 100 !== 13 ? "rd" : "th";
  return `${value}${suffix}`;
}

function TeamDriverCard({ driver, team }: { driver: Driver; team: Constructor }) {
  const fullName = `${driver.givenName} ${driver.familyName}`;
  const style = teamStyle(team.name);

  return (
    <Link
      href={`/drivers/${driver.id}`}
      aria-label={`View ${fullName} profile`}
      className="group relative block overflow-hidden rounded-md border border-white/10 bg-black transition hover:-translate-y-1 hover:border-white/20"
      style={{ background: `linear-gradient(135deg, ${style.secondary}, #08090d)` }}
    >
      <div className="relative aspect-[682/461]">
        {driver.headshotUrl ? (
          <DriverPhoto
            driver={driver}
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-white/18 py-4 text-sm">
      <span className="font-bold text-white/55">{label}</span>
      <span className="text-right text-lg font-black text-white">{value}</span>
    </div>
  );
}

export default async function ConstructorProfilePage({ params }: { params: Promise<{ constructorId: string }> }) {
  const { constructorId } = await params;
  const [constructors, drivers] = await Promise.all([getConstructors(), getDrivers()]);
  const team = constructors.find((item) => item.id === constructorId);
  if (!team) notFound();

  const style = teamStyle(team.name);
  const teamDrivers = drivers.filter((driver) => driver.constructorId === team.id || team.drivers.includes(driver.code));
  const position = [...constructors].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)).findIndex((item) => item.id === team.id) + 1;
  const seasonStats = [
    ["Season Position", ordinal(position)],
    ["Season Points", team.points ?? 0],
    ["Grand Prix Wins", team.wins ?? 0],
    ["Grand Prix Podiums", team.podiums ?? "--"],
    ["Grand Prix Poles", team.poles ?? "--"],
    ["Grand Prix Top 10s", team.topTens ?? "--"],
    ["Fastest Laps", team.fastestLaps ?? "--"],
    ["Recent Form", team.recentForm?.join(" / ") ?? "TBC"]
  ];

  return (
    <>
      <PageHeader title={team.name} eyebrow="Constructor profile" />

      <Panel className="mb-8 overflow-hidden p-0">
        <div className="relative min-h-72 p-6" style={{ background: `linear-gradient(135deg, ${style.secondary}, #050508 72%)` }}>
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TeamLogo name={team.name} className="h-11 w-11" />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">2026 contender</p>
                <h2 className="mt-1 text-2xl font-black uppercase text-white">{team.name}</h2>
              </div>
            </div>
            <span className="rounded-full border border-white/25 px-4 py-2 text-xs font-black uppercase text-white/70">{team.nationality}</span>
          </div>
          <div className="relative z-10 mx-auto mt-8 h-40 max-w-4xl">
            {team.carImageUrl ? (
              <Image
                src={team.carImageUrl}
                alt={`${team.name} 2026 car`}
                fill
                sizes="(min-width: 1024px) 860px, 100vw"
                className="object-contain drop-shadow-[0_32px_28px_rgba(0,0,0,0.7)]"
                priority
              />
            ) : (
              <CarSilhouette teamName={team.name} className="h-full w-full" />
            )}
          </div>
        </div>
      </Panel>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-black uppercase">Drivers</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {teamDrivers.map((driver) => <TeamDriverCard key={driver.id} driver={driver} team={team} />)}
        </div>
      </section>

      <div className="mb-4 h-3 bg-apex" />
      <h2 className="mb-6 text-2xl font-black uppercase">Statistics</h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.92fr]">
        <section>
          <h3 className="mb-4 text-xl font-black uppercase">2026 Season</h3>
          <div className="grid gap-x-10 sm:grid-cols-2">
            {seasonStats.map(([label, value]) => (
              <div key={label} className="border-b border-white/20 py-4">
                <p className="text-xs font-bold text-white/50">{label}</p>
                <p className="mt-2 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <Panel className="bg-[#2e2f36]">
          <h3 className="mb-4 text-2xl font-black uppercase">Season Summary</h3>
          <DetailRow label="Grands Prix Entered" value={team.racesEntered ?? "--"} />
          <DetailRow label="Championship Points" value={team.points ?? "--"} />
          <DetailRow label="Wins" value={team.wins ?? "--"} />
          <DetailRow label="Podiums" value={team.podiums ?? "--"} />
          <DetailRow label="Pole Positions" value={team.poles ?? "--"} />
          <Link href="/standings" className="mt-8 inline-flex rounded-full border border-white px-5 py-2 text-xs font-black uppercase hover:border-apex hover:text-apex">
            Results archive
          </Link>
        </Panel>
      </div>
    </>
  );
}
