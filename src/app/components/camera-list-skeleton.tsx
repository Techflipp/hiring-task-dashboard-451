
import React from "react";
import CameraSkeleton from "./ui/camera-skeleton";

const CameraListSkeleton = ({ size = 5 }: { size?: number }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: size }).map((_, i) => (
          <CameraSkeleton key={i} />
        ))}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    </>
  );
};

export default CameraListSkeleton;
