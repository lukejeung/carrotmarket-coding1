"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ITweet } from "@/app/(home)/actions";
import { IResponse } from "@/components/response-form";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { ZodError } from "zod";

export async function getTweetDetail(id: string): Promise<ITweet & { responses: IResponse[] }> {
  const tweet = await db.tweet.findUnique({
    where: { tweet_no: Number(id) },
    include: {
      user: {
        select: {
          user_no: true,
          username: true,
        },
      },
      responses: {
        select: {
          id: true,
          response_txt: true,
          created_at: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  if (!tweet) throw new Error("Tweet not found");

  return {
    id: tweet.tweet_no,
    tweet: tweet.tweet,
    created_at: tweet.created_at,
    user: {
      user_no: tweet.user!.user_no,
      username: tweet.user!.username,
    },
    responses: tweet.responses!.map((res) => ({
      id: res.id,
      response: res.response_txt,
      createdAt: res.created_at,
      user: {
        username: res.user.username,
      },
    })),
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
  response: z.string().min(1).max(280),
});

export async function createResponse(tweetId: number, content: string) {
  const validation = responseSchema.safeParse({ content });

  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    };
  }

  const session = await getSession();
  if (!session || !session.user.id) {
    return {
      error: "로그인이 필요합니다",
    };
  }

  return db.response.create({
    data: {
      response_txt: content,
      user: {
        connect: {
          user_no: session.user.id,
        },
      },
      tweet: {
        connect: {
          tweet_no: Number(tweetId),
        },
      },
    },
  });
}

export async function addResponse({
  formData,
  tweetId,
}: {
  formData: FormData;
  tweetId: number;
}): Promise<
  | {
      fieldErrors?: {
        response?: string[];
      };
    }
  | null
> {
  const data = {
    response: formData.get("response"),
  };
  const result = responseSchema.safeParse(data);

  if (!result.success) {
    return {
  fieldErrors: (result.error as ZodError).flatten().fieldErrors,
};
  }

  const session = await getSession();
  if (session && session.user.id) {
    await db.response.create({
      data: {
        response_txt: result.data.response, // ✅ 수정됨
        user: {
          connect: {
            user_no: session.user.id,
          },
        },
        tweet: {
          connect: {
            tweet_no: tweetId,
          },
        },
      },
    });
    revalidatePath(`/tweets/${tweetId}`);
  }

  return null; // ✅ 성공 시 명시적으로 null 반환
}

export async function getNewResponse(tweetId: number) {
  const [latest] = await db.response.findMany({
    where: {
      tweetNo: tweetId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
    take: 1, // 가장 최신 응답 하나만
  });

  if (!latest) return null;

  return {
    id: latest.id,
    response: latest.response_txt, // ✅ 이름 매핑
    user: {
      username: latest.user.username,
    },
  };
}

export async function getMoreResponses(tweetId: number, cursorId: number) {
  const rawResponses = await db.response.findMany({
    where: {
      tweetNo: tweetId,
    },
    select: {
      id: true,
      response_txt: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    cursor: cursorId ? { id: cursorId } : undefined,
    skip: cursorId ? 1 : 0,
    take: 2,
    orderBy: {
      created_at: "desc",
    },
  });

  // ✅ response_txt → response로 이름 변경
  return rawResponses.map((r) => ({
    id: r.id,
    response: r.response_txt,
    user: {
      username: r.user.username,
    },
  }));
}

export async function likeTweet(tweetId: number) {
  await new Promise((r) => setTimeout(r, 1000));
  const session = await getSession();
  if (!session || !session.user.id) {
    throw new Error("로그인이 필요합니다.");
  }
  try {
    await db.like.create({
      data: {
        tweetNo: tweetId,      // ✅ 필드명 정확히
        userNo: session.user.id,    // ✅ 필드명 정확히
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
    if (!session) {
  return { error: "세션을 가져올 수 없습니다. 다시 로그인해주세요." };
}
    await db.like.delete({
      where: {
        userNo_tweetNo: {
          userNo: session.user.id!,
          tweetNo: tweetId,
        },
      }
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
