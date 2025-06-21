'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CameraMenuProps {
  cameraId: string;
}

export default function CameraMenu({ cameraId }: CameraMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setOpen(!open);
  const handleNavigate = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  return (
    <div className="relative z-50 inline-block text-left">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <button
            onClick={() => handleNavigate(`/cameras/${cameraId}`)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            View
          </button>
          <button
            onClick={() => handleNavigate(`/cameras/${cameraId}/edit`)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Edit camera
          </button>
          <button
            onClick={() => handleNavigate(`/cameras/${cameraId}/analytics`)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            analytics
          </button>
        </div>
      )}
    </div>
  );
}
