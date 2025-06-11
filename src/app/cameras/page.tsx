"use client"

import { Suspense } from 'react';
import { CameraList } from '@/components/cameras/CameraList';

export default function CamerasPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CameraList />
    </Suspense>
  );
}