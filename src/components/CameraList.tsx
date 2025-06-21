"use client";
import React, { useState, useMemo, useCallback } from "react";
import CameraDetails from "./CameraSidebar";
import { useCameras } from "../hooks/useCameras";
import {
  DemographicsConfig,
  Genders,
  Ages,
  Emotions,
  EthnicGroups,
} from "../types/demographics";
import { Skeleton } from "./Skeleton";

// Use correct API response fields: items, total, page, size, pages
export default function CameraList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCamera, setSelectedCamera] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // One-to-one demographics config: cameraId -> config
  const [demographicsMap, setDemographicsMap] = useState<
    Record<number, DemographicsConfig>
  >({});

  // Fetch cameras from API with auto-refresh every 30s
  const { data, isLoading, isError, error, refetch } = useCameras(
    page,
    pageSize,
    search,
    { refetchInterval: 30000 } // 30 seconds
  );
  const cameras: any[] = data?.items || [];
  const totalPages = data?.pages || 1;

  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) =>
      cam.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, cameras]);

  const paginatedCameras = filteredCameras.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // Memoize handler to avoid unnecessary rerenders
  const handleRowClick = useCallback((cam: any) => {
    setSelectedCamera(cam);
    setDetailsOpen(true);
  }, []);
  const handleDetailsClose = useCallback(() => {
    setDetailsOpen(false);
    setTimeout(() => setSelectedCamera(null), 500); // Wait for animation
  }, []);
  // Demographics handlers
  const handleUpdateDemographics = (
    cameraId: string, // changed from number to string
    config: DemographicsConfig
  ) => {
    setDemographicsMap((prev) => {
      const updated = { ...prev, [cameraId]: config };
      // Save to localStorage for cross-page analytics
      if (typeof window !== "undefined") {
        localStorage.setItem("demographicsMap", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex flex-col relative overflow-x-hidden">
      {/* Header/Navbar */}
      <header className="w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-black shadow-lg py-7 px-4 mb-8 flex items-center justify-center">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">
          Camera List
        </h1>
      </header>
      <main
        className={`flex-1 flex flex-row items-start justify-center w-full transition-all duration-500 ease-in-out ${
          detailsOpen ? "mr-0 md:mr-[600px]" : ""
        }`}
      >
        <div
          className={`w-full max-w-6xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-2xl shadow-2xl border border-zinc-800 p-8 transition-all duration-500 ease-in-out ${
            detailsOpen ? "md:scale-90 md:ml-[-200px]" : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-6 py-3 text-lg rounded-xl border border-white bg-zinc-900 focus:outline-none focus:ring-2  w-full sm:w-80 text-white placeholder:text-pink-400 shadow"
            />
            <div className="flex items-center gap-3">
              <label
                htmlFor="pageSize"
                className="text-pink-400 text-lg font-medium"
              >
                Items per page:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-4 py-2 text-lg rounded-lg border border-white bg-zinc-900 text-white shadow"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(pageSize)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border-b border-zinc-800"
                >
                  <div className="w-24 h-6">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="w-32 h-6">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="w-40 h-6">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="w-32 h-6">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="w-24 h-6">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="w-24 h-6">
                    <Skeleton className="w-full h-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-red-400 py-12 text-xl">
              {error?.message || "Failed to load cameras."}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full text-lg border-separate border-spacing-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
                <thead>
                  <tr>
                    <th className="px-6 py-5 border border-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg text-center">
                      ID
                    </th>
                    <th className="px-6 py-5 border border-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg text-center">
                      Name
                    </th>
                    <th className="px-6 py-5 border border-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg text-center">
                      RTSP URL
                    </th>
                    <th className="px-6 py-5 border border-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg text-center">
                      Tags
                    </th>
                    <th className="px-6 py-5 border border-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg text-center">
                      Status
                    </th>
                    <th className="px-6 py-5 border border-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold text-lg text-center">
                      Snapshot
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cameras.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-pink-300 text-xl"
                      >
                        No cameras found.
                      </td>
                    </tr>
                  ) : (
                    cameras.map((cam: any) => (
                      <tr
                        key={cam.id}
                        className="hover:bg-black/90 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(cam)}
                      >
                        <td className="px-6 py-5 border border-white text-white text-center font-semibold text-lg">
                          {cam.id}
                        </td>
                        <td className="px-6 py-5 border border-white text-white text-center font-semibold text-lg">
                          {cam.name}
                        </td>
                        <td className="px-6 py-5 border border-white text-white text-center font-semibold text-lg">
                          {cam.rtsp_url}
                        </td>
                        <td className="px-6 py-5 border border-white text-center">
                          {cam.tags && cam.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2 justify-center">
                              {cam.tags.map((tag: any) => (
                                <span
                                  key={tag.id}
                                  className="px-2 py-1 rounded"
                                  style={{
                                    background: tag.color,
                                    color: "#222",
                                    fontWeight: 700,
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-400">No tags</span>
                          )}
                        </td>
                        <td className="px-6 py-5 border border-white text-center">
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-base font-bold ${
                              cam.is_active
                                ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white"
                                : "bg-zinc-700 text-white"
                            }`}
                          >
                            {cam.is_active ? "Active" : "Inactive"}
                          </span>
                          <div className="text-xs text-zinc-400 mt-1">
                            {cam.status_message}
                          </div>
                        </td>
                        <td className="px-6 py-5 border border-white text-center">
                          {cam.snapshot && (
                            <img
                              src={cam.snapshot}
                              alt="Snapshot"
                              className="w-24 h-16 object-cover rounded shadow border border-pink-400 mx-auto"
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-6 py-3 rounded-xl bg-blue-200 dark:bg-zinc-800 text-blue-900 dark:text-zinc-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-300 dark:hover:bg-zinc-700 transition-colors shadow"
            >
              Previous
            </button>
            <span className="text-zinc-700 dark:text-zinc-200 font-bold text-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-xl bg-blue-200 dark:bg-zinc-800 text-blue-900 dark:text-zinc-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-300 dark:hover:bg-zinc-700 transition-colors shadow"
            >
              Next
            </button>
          </div>
        </div>
        <CameraDetails
          camera={selectedCamera}
          open={detailsOpen}
          onClose={handleDetailsClose}
          demographics={
            selectedCamera ? demographicsMap[selectedCamera.id] : undefined
          }
          onUpdateDemographics={handleUpdateDemographics}
        />
      </main>
    </div>
  );
}
