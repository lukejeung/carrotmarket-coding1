import { getUserProfile, getUserTweets } from "./actions";
import { notFound } from "next/navigation";
import TweetCard from "@/components/tweet-card";
import BackButton from "@/app/components/back-button";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const session = await getSession();

  // 새로고침 버튼 동작
  const handleRevalidate = async () => {
    "use server"; // 서버에서 실행
    revalidatePath(`/users/${username}`);
  };

  const [profile, tweets] = await Promise.all([
    getUserProfile(username),
    getUserTweets(username),
  ]);

  if (!profile) {
    notFound();
  }

  const isOwner = Number(session?.user.id) === profile?.user_no;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <BackButton />
        {/* 새로고침 버튼으로 변경 */}
        <button
          className="text-blue-500 hover:underline"
          type="button"
          onClick={handleRevalidate}
        >
          새로고침
        </button>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-gray-600">@{profile.username}</p>
          {profile.bio && <p className="mt-2">{profile.bio}</p>}
          <p className="text-gray-600 text-sm mt-2">
            가입일: {new Date(profile.created_dt).toLocaleDateString()}
          </p>
          {isOwner && (
            <Link
              href={`/users/${username}/edit`}
              className="text-blue-500 hover:underline"
            >
              프로필 수정
            </Link>
          )}
        </div>
      </div>
      <div className="border-b border-gray-300 mb-4" />
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.tweet_no} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
