"use client";

interface ListTweetProps {
  tweet: string;
  created_at: Date;
  user: {
    username: string;
  };
  _count: {
    likes: number;
    responses: number;
  };
}

export default function ListTweet({
  tweet,
  created_at,
  user,
  _count,
}: ListTweetProps) {
  return (
    <div className="flex flex-col px-6 py-4 gap-2 rounded-xl ring-4 ring-slate-300 hover:bg-slate-300 transition">
      <div className="flex justify-between items-center">
        <span className="text-md text-slate-500 font-bold r-3">
          {user.username}
        </span>
        <span className="text-xs text-slate-400">
          {created_at.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          })}
        </span>
      </div>
      <span className="text-lg font-medium text-slate-700">{tweet}</span>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <svg
            className="fill-none stroke-2 stroke-slate-600 w-4 mr-1"
            data-slot="icon"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z"></path>
          </svg>
          <span className="text-slate-600 text-xs">{_count.likes}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="fill-none stroke-2 stroke-slate-600 w-4 mr-1"
            data-slot="icon"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 10c0-3.967 3.69-7 8-7 4.31 0 8 3.033 8 7s-3.69 7-8 7a9.165 9.165 0 0 1-1.504-.123 5.976 5.976 0 0 1-3.935 1.107.75.75 0 0 1-.584-1.143 3.478 3.478 0 0 0 .522-1.756C2.979 13.825 2 12.025 2 10Z"
            ></path>
          </svg>
          <span className="text-slate-600 text-xs">{_count.responses}</span>
        </div>
      </div>
    </div>
  );
}