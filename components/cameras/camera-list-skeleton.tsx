export function CameraListSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 sm:p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-xl"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="h-4 sm:h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="flex space-x-2 sm:space-x-3">
              <div className="flex-1 h-8 sm:h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
