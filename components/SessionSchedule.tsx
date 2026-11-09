import type { Session } from "@/lib/api";
import { EmptyState } from "./EmptyState";
import { StatusBadge } from "./StatusBadge";

export function SessionSchedule({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No session schedule yet"
        message="The provider did not return practice, qualifying, sprint, or race times for this Grand Prix."
      />
    );
  }

  return (
    <div className="border-y border-white/[0.08]">
      {sessions.map((session) => (
        <div key={session.id} className="flex items-center justify-between gap-3 border-b border-white/[0.08] py-4 last:border-b-0">
          <div>
            <p className="font-bold">{session.type}</p>
            <p className="text-sm text-white/55">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(session.startsAt))}</p>
          </div>
          <StatusBadge status={session.status} />
        </div>
      ))}
    </div>
  );
}
