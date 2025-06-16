import { getQueryClient } from "@/clients/getQueryClient";
import CameraView from "@/components/camera/CameraView";
import CameraViewLoading from "@/components/camera/CameraViewLoading";
import {
  AgeEnum,
  EmotionEnum,
  EthnicGroupEnum,
  GenderEnum,
} from "@/constants/apitypes";
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
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    age?: AgeEnum;
    gender?: GenderEnum;
    group?: EthnicGroupEnum;
    emotion?: EmotionEnum;
  }>;
}) {
  const { id } = await params;
  const { age, gender, group, emotion } = await searchParams;

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
    queryFn: () =>
      getDemographicsResults({
        camera_id: id,
        gender: gender,
        age: age,
        emotion: emotion,
        ethnicity: group,
      }),
  });

  return (
    <div className="mainPx w-full py-5 xl:py-10">
      <div className="max-container w-full rounded-2xl">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense key={id} fallback={<CameraViewLoading />}>
            <CameraView
              camera_id={id}
              age={age}
              gender={gender}
              emotion={emotion}
              ethnicity={group}
            />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
