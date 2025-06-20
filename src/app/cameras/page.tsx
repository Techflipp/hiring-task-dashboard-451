"use client";

import { useState } from "react";
import { useCameras } from "@/hooks/use-cameras";
import Link from "next/link";
import { CameraSkelton } from "@/components/skeletons/cameras.skelton";

export default function CameraListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useCameras({
    page: currentPage,
    size: pageSize,
    cameraName: searchQuery,
  });

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight">Cameras</h1>
          <div className="flex gap-4 bg-gray-900 rounded-lg p-2 shadow-inner">
            <input
              type="text"
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <CameraSkelton pageSize={pageSize} />
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {data?.items.map((camera) => (
                <Link
                  href={`/cameras/${camera.id}`}
                  key={camera.id}
                  className="h-full"
                >
                  <div className="flex flex-col h-full rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <h2
                        className={`text-xl font-bold ${
                          !camera.is_active ? "text-gray-400" : ""
                        }`}
                      >
                        {camera.name}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold shadow ${
                          camera.is_active
                            ? "bg-green-400/20 text-green-300 border border-green-400"
                            : "bg-red-400/20 text-red-300 border border-red-400"
                        }`}
                      >
                        {camera.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-300">
                        Status: {camera.status_message}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {camera.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: tag.color + "33",
                            color: tag.color,
                            border: `1px solid ${tag.color}55`,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-gray-300">
                Page {currentPage} of {data?.pages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(data?.pages || 1, p + 1))
                }
                disabled={currentPage === (data?.pages || 1)}
                className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
