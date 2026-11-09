import { AlertTriangle } from "lucide-react";

export function ErrorState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-apex/40 bg-apex/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-apex" aria-hidden />
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="mt-1 text-sm text-white/68">{message}</p>
        </div>
      </div>
    </div>
  );
}
