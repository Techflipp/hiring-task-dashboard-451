
import React from "react";

const DemographicsResultsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-md space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="aspect-video bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="aspect-video bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2 space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Data Table Skeleton */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export default DemographicsResultsSkeleton;
