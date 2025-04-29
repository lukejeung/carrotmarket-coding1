"use client";

import { deleteTweet } from "@/app/tweets/[id]/actions";

export default function DeleteTweet({ tweetId }: { tweetId: number }) {
  return (
    <form action={() => deleteTweet(tweetId)}>
      <button className="text-red-500 text-sm transition hover:font-semibold">
        Delete Tweet
      </button>
    </form>
  );
}