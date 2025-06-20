import { Camera } from "@/app/_lib/types";
import Link from "next/link";

interface CameraDetailsProps {
  camera: Camera;
}

export function CameraDetails({ camera }: CameraDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{camera.name}</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {camera.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              camera.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {camera.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Connection Details
            </h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">RTSP URL</p>
                <p className="mt-1 text-sm text-gray-900 break-all">
                  {camera.rtsp_url}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="mt-1 text-sm text-gray-900">
                  {camera.status_message}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Snapshot</h3>
            <div className="mt-4">
              <img
                src={camera.snapshot}
                alt={`${camera.name} snapshot`}
                className="rounded-md w-full h-auto max-h-60 object-cover"
              />
            </div>
          </div>
        </div>

        {camera.tags && camera.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {camera.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: tag.color, color: "#fff" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Timestamps</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(camera.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(camera.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            href={`/dashboard/cameras/${camera.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Camera
          </Link>
        </div>
      </div>
    </div>
  );
}
