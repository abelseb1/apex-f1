import { NextResponse } from "next/server";
import { getLiveTimingSnapshot } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getLiveTimingSnapshot();
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "s-maxage=10, stale-while-revalidate=5"
    }
  });
}
