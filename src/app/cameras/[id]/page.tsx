import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../../lib/api';
import { CameraDetail } from '../../../../components/camera/camera-detail';
import { Skeleton } from '../../../../components/ui/skeleton';
import Link from 'next/link';
import { Button } from '../../../../components/ui/button';
import { Edit, BarChart3, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function CameraDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Use React.use() to unwrap the Promise as per Next.js 15 docs
  const { id } = await params;

  try {
    // Fetch camera data on the server
    const camera = await apiClient.getCamera(id);

    if (!camera) {
      notFound();
    }

    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
            <Link href="/cameras">
              <Button variant="outline" size="sm" className="w-fit">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{camera.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">Camera Details</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/cameras/${camera.id}/edit`}>
              <Button variant="outline" className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            
            <Link href={`/cameras/${camera.id}/demographics`}>
              <Button className="w-full sm:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                Demographics
              </Button>
            </Link>
          </div>
        </div>

        <CameraDetail camera={camera} />
      </div>
    );
    
  } catch (error) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-red-600 text-sm sm:text-base">
          Error loading camera: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <Link href="/cameras">
          <Button variant="outline" className="mt-4 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Button>
        </Link>
      </div>
    );
  }
}