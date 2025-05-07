"use server";

import db from "@/lib/db";

export async function getUserProfile(username: string) {
  const profile = await db.user.findUnique({
    where: { username },
    select: {
      user_no: true,
      username: true,
      bio: true,
      created_dt: true,
    },
  });

  return profile;
}

export async function getUserTweets(username: string) {
  const tweets = await db.tweet.findMany({
    where: { user: { username } },
    include: {
      user: true,
    },
    orderBy: { created_at: "desc" },
  });
  return tweets;
}