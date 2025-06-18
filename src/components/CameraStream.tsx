"use client";
import { CameraStreamProps } from '@/lib/types';
import React, { useEffect , useState } from 'react';
import Image from 'next/image';


const CameraStream: React.FC<CameraStreamProps> = ({ rtspUrl, snapshotUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
      {error ? (
        <div className="flex flex-col items-center justify-center h-80 bg-red-50 p-4">
          <div className="text-red-600 font-medium mb-2">Stream Error</div>
          <div className="text-sm text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => setError(null)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : !isPlaying ? (
        <div className="flex flex-col items-center justify-center h-80 bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-300">Connecting to stream...</p>
          <p className="text-gray-500 text-sm mt-2">{rtspUrl}</p>
        </div>
      ) : (
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={snapshotUrl || "https://picsum.photos/800/450"}
            alt="Camera Stream"
            className="w-full h-auto object-cover"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <button className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded-full">
        LIVE
      </div>
    </div>
  );
};

export default CameraStream;