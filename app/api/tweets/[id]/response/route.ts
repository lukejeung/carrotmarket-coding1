import { NextRequest, NextResponse } from "next/server";
import { respondToTweet } from "@/lib/tweet";

// 자동으로 context.params에서 id를 추출
export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { id: tweetId } = context.params; // id를 추출하여 tweetId로 사용
  const { content } = await req.json();

  const response = await respondToTweet(tweetId, content);
  return NextResponse.json(response);
}
