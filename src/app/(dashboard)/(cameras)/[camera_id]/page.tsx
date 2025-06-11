/* eslint-disable complexity */
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { cameraQueryFn, cameraQueryKey } from '@/app/_lib/react-query/queries/cameras.queries';
import {
  demographicsQueryFn,
  demographicsQueryKey,
} from '@/app/_lib/react-query/queries/demographics.queries';
import { getServerQueryClient } from '@/app/_lib/react-query/server';

import CameraDemographics from '../_components/camera-demographics';
import CameraDetails from '../_components/camera-details';

export default async function CameraDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ camera_id: string }>;
  searchParams?: Promise<{
    gender: string;
    age: string;
    emotion: string;
    ethnicity: string;
    start_date: string;
    end_date: string;
  }>;
}) {
  const queryClient = getServerQueryClient();

  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const demographicsQueryParams = {
    camera_id: resolvedParams.camera_id,
    gender: resolvedSearchParams?.gender ?? '',
    age: resolvedSearchParams?.age ?? '',
    emotion: resolvedSearchParams?.emotion ?? '',
    ethnicity: resolvedSearchParams?.ethnicity ?? '',
    start_date: resolvedSearchParams?.start_date ?? '',
    end_date: resolvedSearchParams?.end_date ?? '',
  };

  await queryClient.prefetchQuery({
    queryKey: cameraQueryKey({ camera_id: resolvedParams.camera_id }),
    queryFn: () => cameraQueryFn({ camera_id: resolvedParams.camera_id }),
  });

  await queryClient.prefetchQuery({
    queryKey: demographicsQueryKey(demographicsQueryParams),
    queryFn: () => demographicsQueryFn(demographicsQueryParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CameraDetails camera_id={resolvedParams.camera_id} />
      <div className='mt-6'>
        <CameraDemographics demographicsParams={demographicsQueryParams} />
      </div>
    </HydrationBoundary>
  );
}
