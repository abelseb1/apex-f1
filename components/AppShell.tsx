"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Radio, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { Route } from "next";
import { DataFreshness } from "./DataFreshness";

const navItems: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Races" },
  { href: "/standings", label: "Standings" },
  { href: "/drivers", label: "Drivers" },
  { href: "/constructors", label: "Teams" },
  { href: "/live-timing", label: "Live Timing" },
  { href: "/qualifying", label: "Qualifying" },
  { href: "/insights", label: "Insights" },
  { href: "/news", label: "News" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-50 border-b border-white/[0.09] bg-[#15151e]/95 backdrop-blur-xl">
        <div className="h-[3px] bg-apex" />
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex h-11 w-[132px] shrink-0 items-center" aria-label="Formula 1 race centre home">
            <Image src="/f1-logo.png" alt="Formula 1" width={132} height={45} className="h-auto w-[116px]" priority />
          </Link>
          <div className="hidden h-7 w-px bg-white/10 lg:block" aria-hidden />
          <nav className="hidden min-w-0 flex-1 items-center lg:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const isLive = item.href === "/live-timing";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-[68px] shrink-0 items-center gap-2 px-2 text-[0.65rem] font-black uppercase transition xl:px-3 xl:text-[0.72rem] 2xl:px-4 2xl:text-xs ${active ? "text-white" : "text-white/52 hover:text-white"}`}
                >
                  {isLive ? <span className="h-1.5 w-1.5 rounded-full bg-apex shadow-[0_0_12px_rgba(225,6,0,0.9)]" aria-hidden /> : null}
                  {item.label}
                  <span className={`absolute inset-x-3 bottom-0 h-[3px] bg-apex transition ${active ? "opacity-100" : "opacity-0"}`} aria-hidden />
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/live-timing" className="hidden items-center gap-2 rounded border border-white/12 bg-white/[0.04] px-3 py-2 text-[0.68rem] font-black uppercase text-white/80 transition hover:border-apex/70 hover:text-white sm:inline-flex lg:hidden">
              <Radio className="h-3.5 w-3.5 text-apex" aria-hidden /> Live
            </Link>
            <span className="hidden border-l border-white/10 pl-4 text-xs font-black tabular-nums text-white/50 2xl:inline">2026</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded border border-white/12 bg-white/[0.04] text-white lg:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="grid border-t border-white/[0.08] bg-[#101118] px-4 py-3 sm:grid-cols-3 lg:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={`flex min-h-12 items-center border-b border-white/[0.06] px-3 text-sm font-black uppercase ${active ? "border-l-2 border-l-apex bg-white/[0.04] text-white" : "text-white/58"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </header>
      <main className="mx-auto min-h-[calc(100vh-210px)] w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <DataFreshness />
        {children}
      </main>
      <footer className="border-t border-white/[0.08] bg-black/40">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-6 text-xs text-white/38 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Race schedules and standings via Jolpica. Session timing via OpenF1 when available.</p>
          <p>Unofficial fan project. Formula 1 marks remain the property of their respective owners.</p>
        </div>
      </footer>
    </div>
  );
}
