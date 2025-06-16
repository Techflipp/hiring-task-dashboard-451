import CamerasList from "@/components/CamerasList";
import CamerasListSkeleton from "@/components/CamerasListSkeleton";
import { getCamerasResponse } from "@/constants/apitypes";
import { ENDPOINTS } from "@/constants/endpoints";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search: string; size: string; page: string }>;
}) {
  //fetching cameras - using normal fetch to leverage the no-store option and keep the data always up to date

  const params = await searchParams;
  const res = await fetch(
    `${ENDPOINTS.getCameras}?camera_name=${params.search || ""}&page=${Number(params.page) || 1}&size=${Number(params.size) || 50}`,
    { cache: "no-store" },
  );
  const data: getCamerasResponse = await res.json();

  return (
    <div className="mainPx min-h-svh w-full py-5 xl:py-8">
      <div className="max-container w-full">
        <Suspense
          key={params.page + params.size}
          fallback={<CamerasListSkeleton size={Number(params.size)} />}
        >
          <CamerasList
            currentPage={data.page}
            currentSize={data.size}
            currentTotalPages={data.pages}
            cameras={data.items}
          />
        </Suspense>
      </div>
    </div>
  );
}
