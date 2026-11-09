import { LiveTimingBoard } from "@/components/LiveTimingBoard";
import { getLiveTimingSnapshot } from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LiveTimingPage() {
  const snapshot = await getLiveTimingSnapshot();

  return (
    <div className="w-full">
      <LiveTimingBoard initialSnapshot={snapshot} />
    </div>
  );
}
