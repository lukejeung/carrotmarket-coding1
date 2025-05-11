"use client";

import ResponseForm from "./response-form";
import { useState } from "react";

export default function ResponseList({
  tweetId,
  username,
  responses,
}: {
  tweetId: number;
  username: string;
  responses: {
    id: number | string;
    response: string;
    user: { username: string };
    createdAt?: Date;
  }[];
}) {
  // ✅ 상태 이름을 responses 대신 localResponses 등으로 변경
  const [localResponses, setLocalResponses] = useState(responses);

  const handleAddResponse = (newResponse: {
    id: number | string;
    response: string;
    user: { username: string };
    createdAt?: Date;
  }) => {
    const tempResponse = {
      ...newResponse,
      id: `temp-${Date.now()}`,
    };
    setLocalResponses((prev) => [tempResponse, ...prev]);
  };

  const handleRemoveResponse = (id: number | string) => {
    setLocalResponses((prev) => prev.filter((response) => response.id !== id));
  };

  return (
    <div>
      <ResponseForm
        tweetId={tweetId}
        username={username}
        addOptimisticResponse={handleAddResponse}
        removeOptimisticResponse={handleRemoveResponse}
      />
      <div className="space-y-4">
        {localResponses.map((response) => (
          <div key={response.id} className="border-b pb-4">
            <p className="mb-2">{response.response}</p>
            <div className="text-sm text-gray-500">
              <span>{response.user?.username}</span>
              <span className="mx-2">•</span>
              {response.createdAt && (
                <span>{response.createdAt.toLocaleDateString("ko-KR")}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}