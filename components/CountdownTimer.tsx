"use client";

import { useEffect, useMemo, useState } from "react";

export function CountdownTimer({ target }: { target: string }) {
  const targetTime = useMemo(() => new Date(target).getTime(), [target]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = now === null ? 0 : Math.max(0, targetTime - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return (
    <div className="grid grid-cols-4 border-y border-white/[0.08]" aria-label="Countdown to next session">
      {[["D", days], ["H", hours], ["M", minutes], ["S", seconds]].map(([label, value]) => (
        <div key={label} className="border-r border-white/[0.08] p-3 text-center last:border-r-0">
          <span className="block text-2xl font-black tabular-nums">{String(value).padStart(2, "0")}</span>
          <span className="text-[0.65rem] font-black text-white/38">{label}</span>
        </div>
      ))}
    </div>
  );
}
