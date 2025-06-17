"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCameras } from '@/lib/api';
import CameraList from '@/components/CameraList';
import Pagination from '@/components/Pagination';
import SearchInput from '@/components/SearchInput';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CamerasPage() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['cameras', page, size, search],
    queryFn: () => getCameras(page, size, search),
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cameras</h1>
        <a href="/demographics" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">View Demographics</a>
      </div>
      <div className="flex justify-between items-center mb-4">
        <SearchInput onSearch={setSearch} />
        <div className="flex items-center space-x-2">
          <span>Items per page:</span>
          <Select
            value={String(size)}
            onValueChange={(value) => setSize(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={String(size)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <p className="text-red-500">Error fetching cameras</p>
      ) : (
        <>
          <CameraList cameras={data?.items ?? []} />
          <Pagination
            page={page}
            pages={data?.pages ?? 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
