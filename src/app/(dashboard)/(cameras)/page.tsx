import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { camerasQueryFn, camerasQueryKey } from '../../_lib/react-query/queries/cameras.queries';
import { getServerQueryClient } from '../../_lib/react-query/server';

import CameraList from './_components/camera-list';

export default async function CamerasList({
  searchParams,
}: {
  searchParams?: Promise<{ page: string; size: string }>;
}) {
  const queryClient = getServerQueryClient();

  const resolvedParams = await searchParams;

  const params = {
    camera_name: '',
    page: Number(resolvedParams?.page ?? '1'),
    size: Number(resolvedParams?.size ?? '12'),
  };

  await queryClient.prefetchQuery({
    queryKey: camerasQueryKey(params),
    queryFn: () => camerasQueryFn(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CameraList params={params} />
    </HydrationBoundary>
  );
}
