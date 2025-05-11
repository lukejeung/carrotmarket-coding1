import { db } from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/session";

export async function updateProfile(username: string, data: { bio?: string; name?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username || session.user.username !== username) {
    throw new Error("권한이 없습니다.");
  }

  const updated = await db.user.update({
    where: { username },
    data,
  });

  return updated;
}