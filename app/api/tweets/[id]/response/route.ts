import { NextRequest, NextResponse } from "next/server";
import { respondToTweet } from "@/lib/tweet";

export async function POST(req: NextRequest, context) {
  const tweetId = context.params.id;
  const { content } = await req.json();

  const response = await respondToTweet(tweetId, content);
  return NextResponse.json(response);
}
