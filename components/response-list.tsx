"use client";

import { getNewResponse } from "@/app/tweets/[id]/actions";
import { useEffect, useState } from "react";
import ResponseForm from "./response-form";

export interface IResponse {
 id: string;
 response: string;
 user?: {
   username: string;
 };
 createdAt?: Date;
}

export default function ResponseList({
 tweetId,
 username,
}: {
 tweetId: string;
 username: string;
}) {
 const [responses, setResponses] = useState<IResponse[]>([]);

 useEffect(() => {
   const loadResponses = async () => {
     const responses = await getNewResponse(tweetId);
     const formattedResponses = responses.map((response) => ({
       ...response,
       id: response.id.toString(),
     }));
     const sortedResponses = formattedResponses.sort(
       (a: IResponse, b: IResponse) =>
         new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
     );
     setResponses(sortedResponses);
   };

   loadResponses();
 }, [tweetId]);

 const handleAddResponse = async (newResponse: IResponse) => {
   const tempResponse = {
     ...newResponse,
     id: `temp-${Date.now()}`,
   };
   // 낙관적 업데이트: 응답을 즉시 추가
   setResponses((prev) => [tempResponse, ...prev]);
 };

 const handleRemoveResponse = (id: string) => {
   setResponses((prev) => prev.filter((response) => response.id !== id));
 };

 return (
   <div>
     <ResponseForm
       tweetId={tweetId}
       username={username}
       lastId={responses[0]?.id}
       addOptimisticResponse={handleAddResponse}
       removeOptimisticResponse={handleRemoveResponse}
     />
     <div className="space-y-4">
       {responses.map((response) => (
         <div key={response.id} className="border-b pb-4">
           <p className="mb-2">{response.response}</p>
           <div className="text-sm text-gray-500">
             <span>{response.user?.username}</span>
             <span className="mx-2">•</span>
             <span>{response.createdAt!.toLocaleDateString("ko-KR")}</span>
           </div>
         </div>
       ))}
     </div>
   </div>
 );
}