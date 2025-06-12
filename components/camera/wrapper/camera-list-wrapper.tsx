'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { CameraList } from '../camera-list';
import type { Camera, PaginatedResponse } from '../../../lib/types';

interface CameraListWrapperProps {
  data: PaginatedResponse<Camera>;
  currentPage: number;
  pageSize: number;
}

export function CameraListWrapper({ data, currentPage, pageSize }: CameraListWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = useCallback((page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams]);

  const handleSizeChange = useCallback((size: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('size', size.toString());
      // Reset to first page when changing page size
      params.set('page', '1');
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams]);

  return (
    <CameraList
      data={data}
      isLoading={isPending}
      error={null}
      onPageChange={handlePageChange}
      onSizeChange={handleSizeChange}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
}