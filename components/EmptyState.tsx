import { CircleOff } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="glass flex min-h-52 flex-col items-center justify-center rounded-lg p-6 text-center">
      <CircleOff className="mb-3 h-8 w-8 text-white/45" aria-hidden />
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-white/60">{message}</p>
    </div>
  );
}
