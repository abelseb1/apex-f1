import { NextResponse } from "next/server";
import { getNews } from "@/lib/api";

export async function GET() {
  const news = await getNews();
  return NextResponse.json(news, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
    }
  });
}
