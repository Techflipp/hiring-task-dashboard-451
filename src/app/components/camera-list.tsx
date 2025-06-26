
import { getCameras } from "@/lib/api";
import CameraCard from "./camera-card";
import Pagination from "./pagination";
import { Camera } from "@/types/camera";

type Props = {
  search: string;
  page: number;
  size: number;
};

export default async function CameraList({ search, page, size }: Props) {
  const data = await getCameras(search, page, size);
  const {
    items: cameraItems,
    page: currentPage,
    pages,
    size: itemsPerPage,
    total,
  } = data;

  if (cameraItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No cameras found matching your search.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameraItems.map((camera: Camera) => (
          <CameraCard key={camera.id} camera={camera} />
        ))}
      </div>
      <Pagination
        total={total}
        size={itemsPerPage}
        pages={pages}
        page={currentPage}
      />
    </>
  );
}
