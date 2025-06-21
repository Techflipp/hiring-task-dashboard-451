export function CameraSkelton({ pageSize }: { pageSize: number }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-700"></div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-700"></div>
          </div>
          <div className="mb-4">
            <div className="h-4 w-48 animate-pulse rounded bg-gray-700"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, tagIndex) => (
              <div
                key={tagIndex}
                className="h-6 w-16 animate-pulse rounded-full bg-gray-700"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
