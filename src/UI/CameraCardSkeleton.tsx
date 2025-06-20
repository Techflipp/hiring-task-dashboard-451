
const CameraCardSkeleton = ({ viewMode }: { viewMode?: string }) => {
  if (viewMode === "list") {
    return (
      <div className="animate-pulse bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300">
      <div className="relative aspect-video bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default CameraCardSkeleton;