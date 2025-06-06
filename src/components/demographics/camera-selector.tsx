"use client";

import { useCameras } from "@/hooks/use-cameras";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

export function CameraSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCameraId = searchParams.get("camera_id") || "";

  const { data } = useCameras({ size: 100 });

  const handleCameraChange = (cameraId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cameraId) {
      params.set("camera_id", cameraId);
    } else {
      params.delete("camera_id");
    }
    router.push(`/demographics?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <Label>Select Camera</Label>
      <Select
        value={currentCameraId}
        onChange={(e) => handleCameraChange(e.target.value)}
        className="w-full md:w-64">
        <option value="">Choose a camera...</option>
        {data?.items.map((camera) => (
          <option key={camera.id} value={camera.id}>
            {camera.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
