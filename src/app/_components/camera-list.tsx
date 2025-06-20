"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CameraListProps } from "@/app/_lib/types";

export function CameraList({
  cameras,
  total,
  currentPage,
  itemsPerPage,
  searchQuery,
  totalPages,
}: CameraListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Client-side search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const query = formData.get("search") as string;

    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString());
    params.set("camera_name", query);
    params.set("page", "1"); // Reset to first page on new search

    router.push(`/dashboard/cameras?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search cameras..."
            defaultValue={searchQuery}
            className="flex-1 px-4 py-2 border rounded-md"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {/* Camera Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RTSP URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cameras?.map((camera) => (
              <tr key={camera?.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {camera?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {camera?.rtsp_url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    href={`/dashboard/cameras/${camera?.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, total)}
            </span>{" "}
            of <span className="font-medium">{total}</span> cameras
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (currentPage > 1) {
                router.push(
                  `/dashboard/cameras?page=${
                    currentPage - 1
                  }&size=${itemsPerPage}${
                    searchQuery ? `&camera_name=${searchQuery}` : ""
                  }`
                );
              }
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                router.push(
                  `/dashboard/cameras?page=${
                    currentPage + 1
                  }&size=${itemsPerPage}${
                    searchQuery ? `&camera_name=${searchQuery}` : ""
                  }`
                );
              }
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
