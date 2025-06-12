import { apiClient } from '../../../lib/api';
import { CameraSearchWrapper } from '../../../components/camera/wrapper/camera-search-wrapper';
import { CameraListWrapper } from '../../../components/camera/wrapper/camera-list-wrapper';
import type { CameraFilters } from '../../../lib/types';

interface CamerasPageProps {
  searchParams: Promise<{
    camera_name?: string;
    page?: string;
    size?: string;
  }>;
}

export default async function CamerasPage({ searchParams }: CamerasPageProps) {
  const params = await searchParams;
  
  // Parse search parameters with defaults
  const filters: CameraFilters = {
    page: parseInt(params.page || '1', 10),
    size: parseInt(params.size || '20', 10),
    camera_name: params.camera_name || undefined,
  };

  // Fetch data on the server
  const data = await apiClient.getCameras(filters);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
          <p className="text-gray-600 mt-2">
            Manage your camera network and configurations
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <CameraSearchWrapper initialValue={filters.camera_name || ''} />
        </div>

        <CameraListWrapper
          data={data}
          currentPage={filters.page || 1}
          pageSize={filters.size || 20}
        />
      </div>
    </div>
  );
}