export function CameraDetailsSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
          <div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex space-x-2 sm:space-x-3">
          <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
          <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-3 sm:p-4">
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="h-12 bg-gray-100 rounded-lg"></div>
              <div className="h-12 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
