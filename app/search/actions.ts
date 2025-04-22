"use server";

import db from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const SearchSchema = z.object({
  query: z.string().min(1).max(20),
});

export async function searchTweets(query: string) {
  try {
    SearchSchema.parse({ query });
    const searchResults = await db.tweet.findMany({
      where: {
        tweet: {
          contains: query,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    revalidatePath("/search");
    return { success: true, tweets: searchResults };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "검색 중 에러가 발생했습니다." };
  }
}