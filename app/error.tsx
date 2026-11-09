"use client";

import { RotateCcw } from "lucide-react";
import { ErrorState } from "@/components/ErrorState";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <PageHeader title="Race data unavailable" eyebrow="Apex F1" />
      <Panel>
        <ErrorState title="Provider request failed" message="Apex F1 could not load this view. Mock fallback data may still be available on other pages." />
        <button onClick={reset} className="mt-4 inline-flex items-center gap-2 rounded-md bg-apex px-4 py-2 text-sm font-black text-white shadow-glow">
          <RotateCcw className="h-4 w-4" aria-hidden />
          Try again
        </button>
      </Panel>
    </>
  );
}
