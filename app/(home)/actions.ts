"use server";

import { TWEETS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

interface User {
  user_no: number;
  username: string;
}

export interface ITweet {
  id: number;
  tweet: string;
  created_at: Date;
  user: User;
}

const tweetSchema = z.object({
  tweet: z
    .string()
    .min(1, "트윗은 비워둘 수 없습니다")
    .max(280, "트윗은 280자를 초과할 수 없습니다"),
});

export async function getTweets(currentPage: number): Promise<ITweet[]> {
  const tweets = await db.tweet.findMany({
    skip: (currentPage - 1) * TWEETS_PER_PAGE,
    take: TWEETS_PER_PAGE,
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: {
        select: {
          user_no: true,
          username: true,
        },
      },
    },
  });

  return tweets.map((tweet) => ({
    id: tweet.tweet_no,
    tweet: tweet.tweet,
    created_at: tweet.created_at,
    user: {
      user_no: tweet.user.user_no,
      username: tweet.user.username,
    },
  }));
}

export async function getTotalPages() {
  const totalTweets = await db.tweet.count();
  return Math.ceil(totalTweets / TWEETS_PER_PAGE);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createTweet(prevState: any, formData: FormData) {
  const tweet = formData.get("tweet");
  const session = await getSession();

  if (session?.user?.id) {
    try {
      const validatedData = tweetSchema.parse({ tweet });

      const newTweet = await db.tweet.create({
        data: {
          tweet: validatedData.tweet,
          user: {
            connect: {
              user_no: session.user.id,
            },
          },
        },
      });

      return { success: true, tweetId: newTweet.tweet_no };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: error.errors[0].message };
      }
      return { error: "트윗 작성 중 오류가 발생했습니다" };
    }
  }

  return { error: "로그인이 필요합니다" };
}
