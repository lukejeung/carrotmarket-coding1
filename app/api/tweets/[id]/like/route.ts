import { NextResponse } from "next/server";
import { likeTweet } from "@/lib/tweet";
import type { NextRequest } from "next/server";

// 이 타입을 명시적으로 지정해 줍니다
interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, context: RouteContext) {
  const tweetId = context.params.id;

  if (!tweetId) {
    return NextResponse.json({ error: "트윗 ID가 필요합니다." }, { status: 400 });
  }

  try {
    const result = await likeTweet(tweetId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Like Tweet Error:", error);
    return NextResponse.json({ error: "좋아요 처리에 실패했습니다." }, { status: 500 });
  }
}
