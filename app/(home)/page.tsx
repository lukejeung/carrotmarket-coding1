import { Suspense } from "react";
import SearchComponent from "./search-component";

export default function TweetList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}
