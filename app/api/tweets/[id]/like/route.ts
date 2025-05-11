import { NextResponse } from "next/server";
import { likeTweet } from "@/lib/tweet";
import type { NextRequest } from "next/server";

export async function POST(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "트윗 ID가 필요합니다." }, { status: 400 });
  }

  try {
    const result = await likeTweet(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Like Tweet Error:", error);
    return NextResponse.json({ error: "좋아요 처리에 실패했습니다." }, { status: 500 });
  }
}
