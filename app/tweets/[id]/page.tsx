import { getTweetDetail, getUserName } from "./actions";
import Link from "next/link";
import ResponseList from "@/components/response-list";
import { getSession } from "@/lib/session";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import LikeButton from "@/components/like-button";

async function getLikeStatus(tweetId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      userNo_tweetNo: {
        tweetNo: tweetId,
        userNo: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      tweetNo: tweetId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(tweetId: number) {
  const session = await getSession();
  if (!session) {
    return null; // 또는 throw new Error("로그인이 필요합니다.");
  }
  const userId = session.user.id;
  const cachedOperation = nextCache(getLikeStatus, ["tweet-like-status"], {
    tags: [`like-status-${tweetId}`],
  });
  return cachedOperation(tweetId, userId!);
}

// 새로고침 동작
async function revalidateTweet(id: string) {
  "use server";
  revalidatePath(`/tweets/${id}`);
}

export default async function TweetDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session || typeof session.user.id === "undefined") {
    return <div>로그인이 필요합니다</div>;
  }

  if (isNaN(Number(id))) {
    return notFound();
  }

  const tweetDetail = await getTweetDetail(id);
  const { responses, user } = tweetDetail;
  const username = await getUserName(session.user.id);
  const likeStatus = await getCachedLikeStatus(Number(id));
if (!likeStatus) {
  return <div>좋아요 상태를 불러올 수 없습니다.</div>;
}
const { likeCount, isLiked } = likeStatus;


  const handleRevalidate = async () => {
    await revalidateTweet(id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4 *:text-blue-500">
          <Link href="/?page=1">← 목록으로 돌아가기</Link>
          <button
            type="button"
            onClick={handleRevalidate}
            className="text-blue-500 hover:underline"
          >
            새로고침
          </button>
        </div>
        <h1 className="text-lg font-bold mb-4 break-words">
          {tweetDetail.tweet}
        </h1>
        <div className="border-t pt-4 mt-4 text-gray-600">
          <p className="mb-2">
            <span className="font-semibold">작성자:</span>{" "}
            <Link
              className="text-blue-500 font-semibold"
              href={`/users/${user.username}`}
            >
              {user.username}
            </Link>
          </p>
          <p>
            <span className="font-semibold">작성일:</span>{" "}
            {tweetDetail.created_at.toLocaleDateString("ko-KR")}
          </p>
        </div>
        <LikeButton
          isLiked={isLiked}
          likeCount={likeCount}
          tweetId={Number(id)}
        />
      </div>
      <div className="p-6 mt-8 border-t pt-6">
        <h2 className="text-xl font-bold mb-4">답글</h2>
        <ResponseList
          tweetId={Number(id)}
          username={username!}
          responses={responses}
        />
      </div>
    </div>
  );
}
