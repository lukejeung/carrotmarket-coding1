import { NextRequest, NextResponse } from 'next/server';
import { createTweet } from '@/lib/tweet';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tweet = await createTweet(body);
  return NextResponse.json(tweet);
}