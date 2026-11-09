import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]
    ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const title = "F1 2026 | Race Centre";
  const description = "A premium Formula 1 race centre for live timing, standings, sessions, drivers, and teams.";

  return {
    metadataBase: baseUrl,
    title: { default: title, template: "%s | F1 2026" },
    description,
    openGraph: {
      type: "website",
      url: baseUrl,
      siteName: "F1 2026 Race Centre",
      title,
      description,
      images: [{ url: new URL("/og.png", baseUrl), width: 1792, height: 1024, alt: "2026 F1 Race Centre" }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og.png", baseUrl)]
    }
  };
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
