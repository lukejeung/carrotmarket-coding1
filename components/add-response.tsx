"use client";

import { useState } from "react";
import { useOptimistic } from "react";
import { addResponse } from "@/app/tweets/[id]/actions";
import FormBtn from "./form-btn";
import ResponseList from "./response-list";
import { getNewResponse } from "@/app/tweets/[id]/actions";
import { getMoreResponses } from "@/app/tweets/[id]/actions";

interface AddResponseProps {
  tweetId: number;
  initialResponses: {
    id: number;
    response: string;
    user: { username: string };
  }[];
  totalResponses: number;
  username: string;
}

export default function AddResponse({
  tweetId,
  initialResponses,
  totalResponses,
  username,
}: AddResponseProps) {
  const [responses, setResponses] = useState(initialResponses);
  const [cursorId, setCursorId] = useState(
    responses[responses.length - 1]?.id || 0
  );
  const [isLastResponse, setIsLastResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | undefined>([]);

  const [state, reducerFn] = useOptimistic(
    responses,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (currentState, newResponse: any) => {
      return [newResponse, ...currentState];
    }
  );

  const action = async ({
    formData,
    tweetId,
  }: {
    formData: FormData;
    tweetId: number;
  }) => {
    const newResponseText = formData.get("response");
    reducerFn({
      id: Math.random(),
      response: newResponseText,
      user: {
        username: username,
      },
    });

    const result = await addResponse({ formData, tweetId });
    const errors = result?.fieldErrors?.response ?? [];

    if (errors.length > 0) {
      setErrors(errors);
    } else {
      setErrors([]);
      const newResponse = await getNewResponse(tweetId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setResponses((prev: any) => [newResponse, ...prev]);
    }

    if (cursorId === 0) {
      setIsLastResponse(true);
    }
  };

  const onLoadMoreResponsesClick = async () => {
    setIsLoading(true);
    const newResponses = await getMoreResponses(tweetId, cursorId);
    const newCursorId = newResponses[newResponses.length - 1]?.id;
    if (newResponses.length === 0) {
      setIsLastResponse(true);
    } else {
      setCursorId(newCursorId);
      setResponses((prev) => [...prev, ...newResponses]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <form action={(formData) => action({ formData, tweetId })}>
        <textarea
          name="response"
          placeholder="Write your response!"
          maxLength={70}
          required
          className="px-4 py-3 mb-1 placeholder:text-slate-400 bg-transparent rounded-xl w-full h-22 focus:outline-none ring-2 transition ring-slate-300 focus:ring-4 border-none resize-none"
        ></textarea>
        {errors?.map((error, index) => (
          <span key={index} className="text-red-600">
            {error}
          </span>
        ))}
        <FormBtn text="Post Response" />
      </form>
      <ResponseList
  tweetId={tweetId}
  username={username}
  responses={state}
/>
      {isLastResponse || responses.length >= totalResponses ? null : (
        <button
          onClick={onLoadMoreResponsesClick}
          disabled={isLoading}
          className="mx-auto text-sm text-slate-600 bg-slate-300 w-fit px-3 py-2 rounded-md hover:opacity-90 transition"
        >
          {isLoading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}