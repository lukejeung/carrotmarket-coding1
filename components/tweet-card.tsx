import Link from "next/link";
import { ITweet } from "../app/(home)/actions";

interface TweetCardProps {
  tweet: ITweet;
}

export default function TweetCard({ tweet }: TweetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/tweets/${tweet.id}`} className="block p-4">
        <div className="font-bold text-gray-800 mb-1">
          @{tweet.user.username}
        </div>
        <div className="text-gray-600">{tweet.tweet}</div>
      </Link>
    </div>
  );
}