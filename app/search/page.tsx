import { useState } from "react";
import { searchTweets } from "./actions";
import TweetCard from "@/components/tweet-card";
import Input from "@/components/input";
import { ITweet } from "../(home)/actions";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearched(true);
    const results = await searchTweets(query);
    if (results.error) {
      setError(results.error);
      setTweets([]);
    } else if (results.tweets) {
  const mappedTweets: ITweet[] = results.tweets.map((tweet) => ({
    id: tweet.tweet_no, // 매핑
    tweet: tweet.tweet,
    created_at: tweet.created_at,
    user: {
      user_no: tweet.user.user_no, // 매핑
      username: tweet.user.username,
    },
  }));
  setTweets(mappedTweets);
  setError(null);
}
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Link className="text-blue-500" href="/?page=1">
        ← 목록으로 돌아가기
      </Link>

      <form onSubmit={handleSearch} className="flex justify-center">
        <div className="flex gap-2">
          <Input
            name="query"
            placeholder="트윗 검색하기..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 rounded-3xl text-white"
          >
            검색
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 text-red-500 bg-red-100 rounded-lg">{error}</div>
      )}

      <div className="space-y-4">
        {error == null && isSearched && tweets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            검색 결과가 없습니다.
          </div>
        ) : (
          tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
        )}
      </div>
    </div>
  );
}