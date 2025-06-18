export function CameraDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-6">
          <div className="w-40 h-28 bg-gray-800 rounded-lg animate-pulse" />

          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-800 rounded animate-pulse mb-2" />
            <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="h-6 w-40 bg-gray-700 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-20 bg-gray-700 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="h-6 w-48 bg-gray-700 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-4 w-40 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
