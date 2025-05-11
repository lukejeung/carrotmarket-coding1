import { NextRequest, NextResponse } from 'next/server';
import { respondToTweet } from '@/lib/tweet';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, context: RouteContext) {
  const tweetId = context.params.id;
  const { content } = await req.json();
  const response = await respondToTweet(tweetId, content);
  return NextResponse.json(response);
}