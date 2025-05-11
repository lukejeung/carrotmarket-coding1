import { useState } from 'react';

export function useTweetActions() {
  const [loading, setLoading] = useState(false);

  const likeTweet = async (tweetId: string) => {
    setLoading(true);
    await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' });
    setLoading(false);
  };

  const respondToTweet = async (tweetId: string, content: string) => {
    setLoading(true);
    await fetch(`/api/tweets/${tweetId}/response`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    setLoading(false);
  };

  return { likeTweet, respondToTweet, loading };
}
