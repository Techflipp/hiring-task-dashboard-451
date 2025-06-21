
import { Suspense } from 'react';
import { Metadata } from 'next';
import  CameraCardSkeleton  from '@/UI/CameraCardSkeleton';
import  Link  from 'next/link';
import { getCameraData } from '@/lib/getCameraData';
import { Camera, Tag, DemographicsConfig } from "@/types/camera";

// Types
interface CameraDetailPageProps {
   id:string
}

 
 
// Generate metadata for SEO
export async function generateMetadata(paramsPromise: { params: Promise<CameraDetailPageProps> }): Promise<Metadata> {
  try {
      const { id } = await paramsPromise.params;  
    const camera = await getCameraData(id);
    
    if (!camera) {
      return {
        title: 'Camera Not Found | Security System',
        description: 'The requested camera could not be found or is not available.',
        robots: { index: false, follow: false },
      };
    }
    
    return {
      title: `${camera.name} - Camera Details | Security System`,
      description: `View detailed information about ${camera.name} camera including live stream, status, and configuration settings. ${camera.is_active ? 'Currently active' : 'Currently inactive'}.`,
      keywords: [
        'security camera',
        'surveillance',
        camera.name,
       ...camera.tags.map((tag: Tag) => tag.name),
        'live stream',
        'monitoring'
      ],
      openGraph: {
        title: `${camera.name} - Camera Details`,
        description: `Camera status: ${camera.is_active ? 'Active' : 'Inactive'}. ${camera.status_message}`,
        images: [
          {
            url: camera.snapshot,
            width: camera.stream_frame_width,
            height: camera.stream_frame_height,
            alt: `${camera.name} camera snapshot`,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${camera.name} - Camera Details`,
        description: `Camera monitoring system - ${camera.is_active ? 'Active' : 'Inactive'}`,
        images: [camera.snapshot],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    return {
      title: 'Camera Not Found | Security System',
      description: 'The requested camera could not be found.',
      robots: { index: false, follow: false },
    };
  }
}

// Client-side component for real-time updates
function CameraDetailClient({ 
  cameraId, 
  initialData 
}: { 
  cameraId: string; 
  initialData: Camera | null;
}) {
  
  // Use server data as fallback, or client data if available
  const cameraData =  initialData;

  // If no data available from both server and client
  if (!cameraData && !initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📹</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Camera Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The camera you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/cameras"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Cameras
          </a>
        </div>
      </div>
    );
  }

  if ( !initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h1>
          <p className="text-gray-600 mb-6">
            Unable to connect to the camera service. Please check your connection and try again.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <a 
              href="/cameras" 
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-block"
            >
              Back to Cameras
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show loading skeleton if no data yet
  if (!cameraData) {
    return <CameraCardSkeleton  />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {cameraData.name}
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    cameraData.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {cameraData.is_active ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-gray-500">
                  Updated: {new Date(cameraData.updated_at).toLocaleString()}
                </span>
              </div>
            </div>
            {!initialData && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Camera Preview */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-900 relative">
                <img
                  src={cameraData.snapshot}
                  alt={`${cameraData.name} snapshot`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {!cameraData.is_active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-xl font-semibold mb-2">
                        Camera Offline
                      </div>
                      <div className="text-sm opacity-75">
                        {cameraData.status_message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stream Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Stream Configuration
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {cameraData.stream_fps}
                  </div>
                  <div className="text-sm text-gray-500">FPS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {cameraData.stream_quality}%
                  </div>
                  <div className="text-sm text-gray-500">Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {cameraData.stream_frame_width}×
                    {cameraData.stream_frame_height}
                  </div>
                  <div className="text-sm text-gray-500">Resolution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {cameraData.stream_skip_frames}
                  </div>
                  <div className="text-sm text-gray-500">Skip Frames</div>
                </div>
              </div>
            </div>

            {/* Demographics Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Analytics Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Detection Confidence
                    </span>
                    <span className="text-sm text-gray-900">
                      {(
                        cameraData.demographics_config
                          .detection_confidence_threshold * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Demographics Confidence
                    </span>
                    <span className="text-sm text-gray-900">
                      {(
                        cameraData.demographics_config
                          .demographics_confidence_threshold * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Track History Length
                    </span>
                    <span className="text-sm text-gray-900">
                      {cameraData.demographics_config.track_history_max_length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Exit Threshold
                    </span>
                    <span className="text-sm text-gray-900">
                      {cameraData.demographics_config.exit_threshold}s
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Min Track Duration
                    </span>
                    <span className="text-sm text-gray-900">
                      {cameraData.demographics_config.min_track_duration}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Save Interval
                    </span>
                    <span className="text-sm text-gray-900">
                      {cameraData.demographics_config.save_interval}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Frame Skip Interval
                    </span>
                    <span className="text-sm text-gray-900">
                      {cameraData.demographics_config.frame_skip_interval}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Box Area Threshold
                    </span>
                    <span className="text-sm text-gray-900">
                      {(
                        cameraData.demographics_config.box_area_threshold * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Camera Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Camera Information
              </h3>
              <div className="space-y-3">
                <div>
                 
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    RTSP URL
                  </label>
                  <p className="text-sm text-gray-900 font-mono break-all">
                    {cameraData.rtsp_url}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <p className="text-sm text-gray-900">
                    {cameraData.status_message}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Created
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(cameraData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {cameraData.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cameraData.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        border: `1px solid ${tag.color}40`,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className=" gap-7  flex justify-center items-center flex-col-reverse">
                {cameraData.demographics_config.id ? (
                  <Link
                     href={`/cameras/${cameraData.id}/demographics/edit`}
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Edit configuration
                  </Link>
                ) : (
                  <Link
                  href={`/cameras/${cameraData.id}/demographics/edit`}
                    className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Create configuration
                  </Link>
                )}

                <Link
                  href={cameraData.snapshot}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Snapshot
                </Link>

                <Link
                  href={`/cameras/${cameraData.id}/edit`}
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Camera
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default async function CameraDetailPage(paramsPromise: { params: Promise<CameraDetailPageProps> }) {
       const { id } = await paramsPromise.params;  
     const initialData = await getCameraData(id);
  
  // If no data from server, still render the client component
  // The client component will handle the error states
  return (
    <Suspense fallback={<CameraCardSkeleton />}>
      <CameraDetailClient cameraId={id} initialData={initialData} />
    </Suspense>
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  // You can pre-generate paths for popular cameras
  // This is optional and depends on your use case
  return [];
}