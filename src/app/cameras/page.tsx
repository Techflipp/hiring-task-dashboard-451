import { CameraList } from "@/components/camera/CameraList";
import { Suspense } from "react";

export default function CamerasPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Camera List</h1>
      <Suspense><CameraList /></Suspense>
    </div>
  );
}
