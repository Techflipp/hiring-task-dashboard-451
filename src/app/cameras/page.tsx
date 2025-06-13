"use client"

import { Suspense } from 'react';
import { CameraList } from '@/components/cameras/CameraList';
import { Skeleton } from '@/components/ui/Skeleton';

// Configure the page for dynamic data fetching
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function CamerasPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cameras</h1>
      </div>
      
      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} height={320} className="rounded-lg" />
            ))}
          </div>
        }
      >
        <CameraList />
      </Suspense>
    </div>
  );
}