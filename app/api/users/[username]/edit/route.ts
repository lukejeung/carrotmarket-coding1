import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/lib/user";

export async function POST(req: NextRequest) {
  // URL에서 username 추출
  const url = new URL(req.url);
  const username = url.pathname.split("/").at(-2); // "/api/users/[username]/edit" → [username]

  if (!username) {
    return NextResponse.json({ error: "유저 이름이 필요합니다." }, { status: 400 });
  }

  const { bio, name } = await req.json();

  try {
    const result = await updateUserProfile(username, { bio, name });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "프로필 업데이트에 실패했습니다." }, { status: 500 });
  }
}
