import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTotalPages, getTweets, ITweet } from "./actions";
import TweetCard from "@/components/tweet-card";
import AddTweet from "@/components/add-tweet";

function SearchComponent() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tweetsData = await getTweets(currentPage);
        const totalPagesData = await getTotalPages();

        setTweets(tweetsData);
        setTotalPages(totalPagesData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="">
        <AddTweet />
      </div>
      <div className="border-b border-gray-300" />
      <div className="flex justify-between items-center">
        <div className="text-lg font-bold">트윗 목록</div>
        <Link
          href="/search"
          className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition-colors"
        >
          검색
        </Link>
      </div>
      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
      <div />
      <div className="flex justify-center gap-4">
        <Link
          href={`/?page=${currentPage - 1}`}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            currentPage <= 1 ? "invisible" : ""
          }`}
        >
          ← 이전
        </Link>
        <span className="flex items-center font-medium">
          {currentPage} / {totalPages}
        </span>
        <Link
          href={`/?page=${currentPage + 1}`}
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            currentPage >= totalPages ? "invisible" : ""
          }`}
        >
          다음 →
        </Link>
      </div>
    </div>
  );
}

export default function TweetList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}