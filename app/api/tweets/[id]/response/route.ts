import { NextRequest, NextResponse } from "next/server";
import { respondToTweet } from "@/lib/tweet";

export async function POST(req: NextRequest, context: any) {
  const { id: tweetId } = context.params;
  const { content } = await req.json();

  const response = await respondToTweet(tweetId, content);
  return NextResponse.json(response);
}
