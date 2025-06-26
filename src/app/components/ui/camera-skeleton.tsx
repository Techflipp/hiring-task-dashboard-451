
import React from "react";

const CameraSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative aspect-video bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 mb-2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 mb-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CameraSkeleton;
