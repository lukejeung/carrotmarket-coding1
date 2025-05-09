import { Suspense } from "react";
import SearchComponent from "./search-component";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}
