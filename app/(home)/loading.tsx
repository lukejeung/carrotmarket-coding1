export default function Loading() {
  return (
    <div className="flex flex-col w-2/3 gap-6 my-10">
      <div className="animate-pulse h-28 w-full bg-neutral-500 rounded-md"></div>
      <div className="animate-pulse flex flex-col gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="*:rounded-md flex gap-4">
            <div className="flex flex-col gap-6 *:rounded-md">
              <div className="bg-neutral-500 h-11 w-60" />
              <div className="bg-neutral-500 h-6 w-40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}