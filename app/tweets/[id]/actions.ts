"use server";

import { ITweet } from "@/app/(home)/actions";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function getTweetDetail(id: string): Promise<ITweet> {
  const tweet = await db.tweet.findUnique({
    where: { tweet_no: Number(id) },
    include: {
      user: {
        select: {
          user_no: true,
          username: true,
        },
      },
    },
  });

  if (!tweet) throw new Error("Tweet not found");

  return {
    id: tweet.tweet_no, // ✅ 여기를 매핑
    tweet: tweet.tweet,
    created_at: tweet.created_at,
    user: {
      user_no: tweet.user.user_no, // ✅ 여기도 매핑
      username: tweet.user.username,
    },
  };
}

export async function getUserName(user_no: number) {
  const user = await db.user.findUnique({
    where: { user_no },
    select: { username: true },
  });
  return user?.username;
}

const responseSchema = z.object({
  content: z.string().min(1).max(280),
});

export async function createResponse(tweetId: string, content: string) {
  const validation = responseSchema.safeParse({ content });

  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const session = await getSession();
  if (!session.id) {
    return {
      error: "로그인이 필요합니다",
    };
  }

  return db.response.create({
    data: {
      response: content,
      userId: session.id,
      tweetId: Number(tweetId),
    },
  });
}

export async function addResponse({
  formData,
  tweetId,
}: {
  formData: FormData;
  tweetId: number;
}) {
  // await new Promise((r) => setTimeout(r, 4000));

  const data = {
    response: formData.get("response"),
  };
  const result = await responseSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      await db.response.create({
        data: {
          response: result.data.response,
          user: {
            connect: {
              user_no: session.id,
            },
          },
          tweet: {
            connect: {
              id: tweetId,
            },
          },
        },
      });
      revalidatePath(`/tweets/${tweetId}`);
    }
  }
}

export async function getNewResponse(tweetId: string) {
  return db.response.findMany({
    where: {
      tweetId: Number(tweetId),
    },
    include: {
      user: {
        select: {
          user_no: true,
          username: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
}

export async function getMoreResponses(tweetId: number, cursorId: number) {
  const responses = await db.response.findMany({
    where: {
      tweetId,
    },
    select: {
      id: true,
      response: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: { id: cursorId },
    skip: cursorId ? 1 : 0,
    take: 2,
    orderBy: {
      created_at: "desc",
    },
  });
  return responses;
}

export async function likeTweet(tweetId: number) {
  await new Promise((r) => setTimeout(r, 1000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function dislikeTweet(tweetId: number) {
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        userId_tweetId: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function deleteTweet(tweetId: number) {
  await db.tweet.delete({
    where: {
      tweet_no: tweetId,
    },
  });
  redirect("/");
}