import dynamic from "next/dynamic";

// 클라이언트 컴포넌트인 SearchComponent를 동적으로 가져옵니다.
const SearchComponent = dynamic(() => import("./search-component"), {
  ssr: false, // 서버 사이드 렌더링을 비활성화합니다 (클라이언트 전용)
});

export default function Page() {
  return <SearchComponent />;
}