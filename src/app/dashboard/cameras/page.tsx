import { CameraList } from "@/app/_components/camera-list";
import { getCameras } from "@/app/_lib/api";

export default async function CamerasPage({
  searchParams,
}: {
  searchParams: { page?: string; size?: string; camera_name?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const size = searchParams.size ? parseInt(searchParams.size) : 20;
  const cameraName = searchParams.camera_name || "";

  const { cameras, total } = await getCameras({ page, size, cameraName });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Camera Management</h1>
      <CameraList
        cameras={cameras}
        total={total}
        currentPage={page}
        itemsPerPage={size}
        searchQuery={cameraName}
      />
    </div>
  );
}
