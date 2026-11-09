import type { RaceStatus } from "@/lib/api";

const styles: Record<string, string> = {
  live: "border-apex/50 bg-apex/[0.15] text-apex",
  upcoming: "border-signal/40 bg-signal/[0.12] text-signal",
  completed: "border-mint/40 bg-mint/[0.12] text-mint",
  Live: "border-apex/50 bg-apex/[0.15] text-apex",
  "Not Live": "border-signal/40 bg-signal/[0.12] text-signal",
  Historical: "border-white/20 bg-white/[0.08] text-white/70",
  Mock: "border-ember/40 bg-ember/[0.12] text-ember"
};

export function StatusBadge({ status }: { status: RaceStatus | "Live" | "Not Live" | "Historical" | "Mock" }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded border px-2.5 py-1 text-xs font-black uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ${styles[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" aria-hidden />
      {status}
    </span>
  );
}
