import dynamic from "next/dynamic";

const SearchComponent = dynamic(() => import("./search-component"), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <SearchComponent />
    </div>
  );
}