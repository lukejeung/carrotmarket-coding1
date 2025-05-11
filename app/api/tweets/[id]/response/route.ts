import { NextRequest, NextResponse } from "next/server";
import { respondToTweet } from "@/lib/tweet";

// Route handler: receives `context` with `params`
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id: tweetId } = context.params; // ← [id] 디렉토리에서 동적으로 추출됨
  const { content } = await req.json();

  const response = await respondToTweet(tweetId, content);
  return NextResponse.json(response);
}
