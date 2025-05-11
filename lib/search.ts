import { db } from "./db";

export async function searchTweetsAndUsers(query: string) {
  const tweets = await db.tweet.findMany({
    where: {
      tweet: {
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      user: true,
    },
  });

  const users = await db.user.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
    },
  });

  return { tweets, users };
}
