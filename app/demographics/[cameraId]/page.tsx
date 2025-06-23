import { Suspense } from "react";
import DemographicsAnalytics from "@/components/demographics-analytics";
import { getCameraById } from "@/lib/api";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DemographicsPageProps {
  params: {
    cameraId: string;
  };
}

async function CameraHeader({ cameraId }: { cameraId: string }) {
  try {
    const camera = await getCameraById(cameraId);

    if (!camera.demographics_config) {
      notFound();
    }

    return (
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cameras
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Camera className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">{camera.name} - Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Demographic analytics data for this camera
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default function CameraDemographicsPage({
  params,
}: DemographicsPageProps) {
  if (!params.cameraId) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        }
      >
        <CameraHeader cameraId={params.cameraId} />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        }
      >
        <DemographicsAnalytics cameraId={params.cameraId} />
      </Suspense>
    </div>
  );
}
