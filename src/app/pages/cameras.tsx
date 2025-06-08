import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { CameraListSkeleton } from '../components/CameraListSkeleton';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: string;
  tags?: string[];
}

interface CameraResponse {
  cameras: Camera[];
  totalPages: number;
}

const fetchCameras = async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }): Promise<CameraResponse> => {
  const response = await axios.get<CameraResponse>('https://task-451-api.ryd.wafaicloud.com/cameras', {
    params: { page, limit, name: search },
  });
  return response.data;
};

export default function CamerasPage() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, error } = useQuery<CameraResponse, Error>({
    queryKey: ['cameras', page, limit, debouncedSearch],
    queryFn: () => fetchCameras({ page, limit, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Camera Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search cameras by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>
      {isLoading ? (
        <CameraListSkeleton />
      ) : error ? (
        <div className="text-red-500">Error: {error.message}</div>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2">Name</th>
                <th className="p-2">Location</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.cameras?.map((camera) => (
                <tr key={camera.id} className="border-b dark:border-gray-600">
                  <td className="p-2">{camera.name}</td>
                  <td className="p-2">{camera.location}</td>
                  <td className="p-2">
                    <Link href={`/cameras/${camera.id}`} className="text-blue-500 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>
            <span>
              Page {page} of {data?.totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === data?.totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
          <div className="mt-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="p-2 border rounded dark:bg-gray-800 dark:text-white"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}