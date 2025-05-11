import { NextRequest, NextResponse } from "next/server";
import { respondToTweet } from "@/lib/tweet";

// URL에서 tweetId 추출
export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const tweetId = url.pathname.split("/").at(-2); // "/api/tweets/[id]/response"에서 [id] 추출

  if (!tweetId) {
    return NextResponse.json({ error: "트윗 ID가 필요합니다." }, { status: 400 });
  }

  const { content } = await req.json();

  try {
    const response = await respondToTweet(tweetId, content);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Respond To Tweet Error:", error);
    return NextResponse.json({ error: "답글 작성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
