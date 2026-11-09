"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { getSeasonDataStatus } from "@/lib/api/jolpicaClient";

export function DataFreshness() {
  const router = useRouter();
  const [data, setData] = useState<Awaited<ReturnType<typeof getSeasonDataStatus>>>();
  useEffect(() => {
    const controller = new AbortController();
    async function check(refresh = false) {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch("/api/data-status", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Status unavailable");
        const result = await response.json();
        setData(result.standings);
        if (refresh) router.refresh();
      } catch { if (!controller.signal.aborted) setData(undefined); }
    }
    void check();
    const timer = setInterval(() => void check(true), 120_000);
    return () => { clearInterval(timer); controller.abort(); };
  }, [router]);
  return <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1 border-b border-white/10 pb-3 text-xs text-white/55" role="status">
    <span>{data?.status === "ok" ? `Jolpica standings / ${data.season} / Round ${data.round}` : data?.status === "stale" ? "Standings refresh delayed / showing last verified data" : data?.status === "pending" ? "Season standings pending" : "Checking data availability"}</span>
    {data?.fetchedAt ? <span>Checked {new Date(data.fetchedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span> : null}
    {data?.status === "unavailable" ? <span>Provider temporarily unavailable</span> : null}
  </div>;
}
