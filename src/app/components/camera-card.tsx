import { Camera } from "@/types/camera";
import Image from "next/image";
import Link from "next/link";

const CameraCard = ({ camera }: { camera: Camera }) => {
  return (
    <Link
      href={`/${camera.id}`}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video bg-gray-100">
        <Image
          fill
          sizes="100%"
          src={camera.snapshot}
          alt={camera.name}
          className="w-full h-full object-cover absolute"
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
            camera.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {camera.is_active ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{camera.name}</h3>
        <p
          className={`text-sm mb-3 ${
            camera.is_active ? "text-green-600" : "text-red-600"
          }`}
        >
          {camera.status_message}
        </p>

        <div className="text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="truncate">{camera.rtsp_url}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              Updated: {new Date(camera.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {camera.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {camera.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs rounded-md"
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    border: `1px solid ${tag.color}`,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CameraCard;
