import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/user";
import type { NextRequest } from "next/server";

interface RouteContext {
  params: {
    username: string;
  };
}

export async function POST(req: NextRequest, context: RouteContext) {
  const username = context.params.username;

  if (!username) {
    return NextResponse.json({ error: "유저 이름이 필요합니다." }, { status: 400 });
  }

  const body = await req.json();
  const { bio, name } = body;

  try {
    const updatedUser = await updateProfile(username, { bio, name });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "프로필 수정에 실패했습니다." }, { status: 500 });
  }
}