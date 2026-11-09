import { NextResponse } from "next/server";
import { getSeasonDataStatus } from "@/lib/api";

export const dynamic = "force-dynamic";
export async function GET() {
  const standings = await getSeasonDataStatus();
  return NextResponse.json({
    standings,
    liveAccessConfigured: Boolean(process.env.OPENF1_ACCESS_TOKEN || (process.env.OPENF1_USERNAME && process.env.OPENF1_PASSWORD)),
    newsConfigured: Boolean(process.env.NEWS_BASE_URL && process.env.NEWS_API_KEY)
  }, { headers: { "Cache-Control": "no-store" } });
}
