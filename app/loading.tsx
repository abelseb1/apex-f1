import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";

export default function Loading() {
  return (
    <>
      <PageHeader title="Loading race data" eyebrow="Apex F1" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <LoadingSkeleton rows={4} />
        </Panel>
        <Panel>
          <LoadingSkeleton rows={3} />
        </Panel>
      </div>
    </>
  );
}
