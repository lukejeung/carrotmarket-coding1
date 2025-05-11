import { db } from './db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/session'
import type { Like, Response, Tweet } from '@prisma/client'

export async function likeTweet(tweetId: string): Promise<{ liked: boolean }> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('로그인 상태가 아닙니다.')

  const existing: Like | null = await db.like.findFirst({
    where: { tweetNo: Number(tweetId), userNo: session.user.id },
  })

  if (existing) {
    await db.like.delete({ where: { id: existing.id } })
    return { liked: false }
  } else {
    await db.like.create({
      data: {
        tweetNo: Number(tweetId),
        userNo: session.user.id,
      },
    })
    return { liked: true }
  }
}

export async function respondToTweet(tweetId: string, text: string): Promise<Response> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('로그인 상태가 아닙니다.')

  const response = await db.response.create({
    data: {
      text,
      userNo: session.user.id,
      tweetNo: Number(tweetId),
    },
  })

  return response
}

interface CreateTweetInput {
  content: string
}

export async function createTweet({ content }: CreateTweetInput): Promise<Tweet> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('로그인 상태가 아닙니다.')

  return await db.tweet.create({
    data: {
      content,
      userNo: session.user.id,
    },
  })
}
