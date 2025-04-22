"use client";

import { createResponse } from "@/app/tweets/[id]/actions";
import { useTransition, useState } from "react";
import { IResponse } from "./response-list";

interface ResponseFormProps {
  tweetId: string;
  username: string;
  lastId?: string;
  addOptimisticResponse: (response: IResponse) => void;
  removeOptimisticResponse: (id: string) => void;
}

export default function ResponseForm({
  tweetId,
  username,
  lastId,
  addOptimisticResponse,
  removeOptimisticResponse,
}: ResponseFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const responseText = formData.get("response") as string;

    const optimisticId = String(Number(lastId) + 1);
    const optimisticResponse = {
      id: optimisticId,
      response: responseText,
      user: {
        username: username,
      },
      createdAt: new Date(),
    };

    startTransition(() => {
      addOptimisticResponse(optimisticResponse);
    });

    const result = await createResponse(tweetId, responseText);

    if ("error" in result) {
      setError(result.error);
      removeOptimisticResponse(optimisticId);
      return;
    }

    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        name="response"
        placeholder="답글을 입력하세요..."
        minLength={1}
        maxLength={280}
        className={`w-full p-2 border rounded mb-2 ${
          error ? "border-red-500" : ""
        }`}
        required
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isPending}
      >
        {isPending ? "전송 중..." : "답글 작성"}
      </button>
    </form>
  );
}