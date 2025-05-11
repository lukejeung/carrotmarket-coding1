import { db } from './db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/session'
import type { Like, Response, Tweet } from '@prisma/client'

export async function likeTweet(tweetId: string): Promise<{ liked: boolean }> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('로그인 상태가 아닙니다.')

  const existing: Like | null = await db.like.findFirst({
    where: { tweetNo: Number(tweetId), userNo: Number(session.user.id) },
  })

  if (existing) {
    await db.like.delete({
      where: {
        userNo_tweetNo: {
          userNo: Number(session.user.id),
          tweetNo: Number(tweetId),
        },
      },
    })
    return { liked: false }
  } else {
    await db.like.create({
      data: {
        tweetNo: Number(tweetId),
        userNo: Number(session.user.id),
      },
    })
    return { liked: true }
  }
}

interface RespondToTweetInput {
  tweetId: string;
  text: string;  // 'text' -> 'response_txt'로 변경
}

export async function respondToTweet({ tweetId, text }: RespondToTweetInput): Promise<Response> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('로그인 상태가 아닙니다.')

  const response = await db.response.create({
    data: {
      response_txt: text,  // 'text' -> 'response_txt'로 수정
      userNo: Number(session.user.id),
      tweetNo: Number(tweetId),
    },
  })

  return response
}

interface CreateTweetInput {
  tweet: string // 'content' -> 'tweet'로 변경
}
export async function createTweet({ tweet }: CreateTweetInput): Promise<Tweet> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('로그인 상태가 아닙니다.')

  return await db.tweet.create({
    data: {
      tweet, // 'content' -> 'tweet'로 변경
      userNo: Number(session.user.id),
    },
  })
}
