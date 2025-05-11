import { NextResponse } from "next/server";
import { searchTweetsAndUsers } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "검색어가 필요합니다." }, { status: 400 });
  }

  try {
    const results = await searchTweetsAndUsers(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "검색에 실패했습니다." }, { status: 500 });
  }
}
