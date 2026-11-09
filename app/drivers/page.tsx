import { DriverCard } from "@/components/DriverCard";
import { PageHeader } from "@/components/PageHeader";
import { getDrivers } from "@/lib/api";

export const revalidate = 120;

export default async function DriversPage() {
  const drivers = await getDrivers();
  return (
    <>
      <PageHeader title="F1 Drivers 2026" eyebrow="Current grid">
        <span className="data-chip">{drivers.length} drivers</span>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {drivers.map((driver, index) => <DriverCard key={driver.id} driver={driver} priority={index < 4} />)}
      </div>
    </>
  );
}
