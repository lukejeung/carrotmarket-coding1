"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { dislikeTweet, likeTweet } from "@/app/tweets/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}

export default function LikeButton({
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
  tweetId,
}: LikeButtonProps) {
  const [state, setState] = useState({
    isLiked: initialIsLiked,
    likeCount: initialLikeCount,
  });
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    // 낙관적 업데이트
    setState(prev => ({
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));

    try {
      if (state.isLiked) {
        await dislikeTweet(tweetId);
      } else {
        await likeTweet(tweetId);
      }
    } catch {
      // 에러 발생시 원래 상태로 복구
      setState({
        isLiked: initialIsLiked,
        likeCount: initialLikeCount,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 mt-2  transition-colors ${
        state.isLiked ? "bg-blue-300 text-white" : "hover:bg-blue-300"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span> {state.likeCount}</span>
      ) : (
        <span>좋아요 ({state.likeCount})</span>
      )}
    </button>
  );
}