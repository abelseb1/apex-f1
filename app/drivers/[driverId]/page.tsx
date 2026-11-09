import { notFound } from "next/navigation";
import { DriverProfileHeader } from "@/components/DriverProfileHeader";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { getDrivers } from "@/lib/api";

export default async function DriverProfilePage({ params }: { params: Promise<{ driverId: string }> }) {
  const { driverId } = await params;
  const driver = (await getDrivers()).find((item) => item.id === driverId);
  if (!driver) notFound();

  return (
    <>
      <PageHeader title="Driver Profile" eyebrow={driver.code} />
      <DriverProfileHeader driver={driver} />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel><p className="text-sm text-white/50">Wins</p><p className="text-3xl font-black">{driver.wins ?? 0}</p></Panel>
        <Panel><p className="text-sm text-white/50">Podiums</p><p className="text-3xl font-black">{driver.podiums ?? "--"}</p></Panel>
        <Panel><p className="text-sm text-white/50">Poles</p><p className="text-3xl font-black">{driver.poles ?? "--"}</p></Panel>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel><h2 className="text-xl font-black">Recent results</h2><p className="mt-3 text-white/65">{driver.recentResults?.join(" / ") ?? "No recent race data"}</p></Panel>
        <Panel><h2 className="text-xl font-black">Season performance</h2><p className="mt-3 text-white/65">Championship points: {driver.points ?? "--"}</p><p className="mt-2 text-white/65">Fastest laps: {driver.fastestLaps ?? "--"}</p></Panel>
      </div>
    </>
  );
}
