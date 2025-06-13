import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Camera as CameraIcon } from 'lucide-react';

interface SafeImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackIcon?: React.ReactNode;
  showLoadingState?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  fallbackIcon,
  showLoadingState = true,
  className,
  alt,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
        {fallbackIcon || <CameraIcon className="w-12 h-12 text-gray-400" />}
      </div>
    );
  }

  return (
    <>
      {showLoadingState && loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">
            <CameraIcon className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      )}
      <Image
        {...props}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        unoptimized
      />
    </>
  );
};