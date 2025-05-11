import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/user";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest, context) {
  const username = context.params.username;

  if (!username) {
    return NextResponse.json({ error: "유저 이름이 필요합니다." }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updated = await updateProfile(username, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "프로필 수정 실패" }, { status: 500 });
  }
}
