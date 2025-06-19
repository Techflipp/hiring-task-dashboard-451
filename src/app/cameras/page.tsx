import { CameraList } from "@/components/camera/CameraList";

export default function CamerasPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Camera List</h1>
      <CameraList />
    </div>
  );
}
