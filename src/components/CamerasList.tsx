import DynamicPagination from "./DynamicPagination";
import CameraCard from "./CameraCards";
import { getCamerasResponse } from "@/constants/apitypes";
import CamerasFilters from "@/components/CamerasFilters";
import { AlertTriangle } from "lucide-react";

export default function CamerasList({
  currentPage,
  currentTotalPages,
  cameras,
}: {
  currentSize: number | null;
  currentTotalPages: number | null | undefined;
  currentPage: number | null;
  cameras: getCamerasResponse["items"];
}) {
  return (
    <section
      id="cameras"
      className="max-container flex-center flex w-full flex-col p-0 py-10 lg:p-4"
    >
      <div className="flex w-full flex-col items-center justify-between lg:flex-row">
        <CamerasFilters />
        <DynamicPagination
          totalPages={currentTotalPages}
          dynamicPage={Number(currentPage)}
        />
      </div>
      {!currentTotalPages || cameras.length === 0 ? (
        <div className="flex-center min-h-60 w-full flex-col gap-2 text-2xl text-red-500">
          <AlertTriangle />
          <h2>No Cameras</h2>
        </div>
      ) : null}
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {cameras.map((item) => (
          <CameraCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
