import { Suspense } from "react";
import CameraDetailsFetcher from "./components/camera-details-fetcher";
import CameraDetailsSkeleton from "./components/ui/camera-details-skeleton";

type Props = {
  params: Promise<{
    cameraId: string;
  }>;
};

export default async function CameraDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const { cameraId } = resolvedParams;

  return (
    <main>
      <div className="container">
        <Suspense fallback={<CameraDetailsSkeleton />}>
          <CameraDetailsFetcher cameraId={cameraId} />
        </Suspense>
      </div>
    </main>
  );
}
