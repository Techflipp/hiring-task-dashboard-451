'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CameraSearch } from '../camera-search';

interface CameraSearchWrapperProps {
  initialValue: string;
}

export function CameraSearchWrapper({ initialValue }: CameraSearchWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Remove dependencies to keep function reference stable
  const handleSearchChange = useCallback((search: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (search.trim()) {
      params.set('camera_name', search.trim());
    } else {
      params.delete('camera_name');
    }
    
    // Reset to first page when searching
    params.set('page', '1');
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router]); // Only depend on router, not searchParams

  return (
    <CameraSearch
      onSearchChange={handleSearchChange}
      initialValue={initialValue}
    />
  );
}