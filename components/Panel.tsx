import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`premium-panel rounded-md p-5 sm:p-7 ${className}`}>{children}</section>;
}
