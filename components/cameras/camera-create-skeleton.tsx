export function CameraCreateSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">

      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
        <div>
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 sm:mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="sm:col-span-2">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded-lg"></div>
          </div>
          <div className="sm:col-span-2">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-10 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4 sm:mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
        <div className="h-12 bg-gray-200 rounded-xl w-24"></div>
      </div>
    </div>
  )
}
