import { getQueryClient } from "@/clients/getQueryClient";
import CameraView from "@/components/camera/CameraView";
import CameraViewLoading from "@/components/camera/CameraViewLoading";
import { getCameraById, getDemographicsResults } from "@/services";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { Suspense } from "react";

//seo
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const camera = await getCameraById(id);

  return {
    title: camera.name,
    description: camera.name,
  };
}

export default async function CameraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // prefetching the data on server to serve non-empty html and use ssr properly
  // the react query client will handle the caching for this page
  // this is how you can implement react query in server components

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["camera"],
    queryFn: () => getCameraById(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["demographics"],
    queryFn: () => getDemographicsResults({ camera_id: id }),
  });

  return (
    <div className="mainPx w-full py-5 xl:py-20">
      <div className="max-container w-full rounded-2xl p-2 lg:p-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense key={id} fallback={<CameraViewLoading />}>
            <CameraView id={id} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
