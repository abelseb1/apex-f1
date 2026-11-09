import type { ReactNode } from "react";

export function PageHeader({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 border-b border-white/[0.1] pb-6 sm:mb-10">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-white/48">
              <span className="h-1.5 w-6 bg-apex" aria-hidden />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-black uppercase leading-[0.95] text-white sm:text-5xl">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
