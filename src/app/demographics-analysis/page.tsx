"use client";

import { useState, useEffect } from "react";
import { DemographicsConfig } from "../../types/demographics";
import { useCameras } from "../../hooks/useCameras";
import { useDemographicsResults } from "../../hooks/useDemographicsResults";
import {
  Genders,
  Ages,
  Emotions,
  EthnicGroups,
} from "../../types/demographics";
import { Skeleton } from "../../components/Skeleton";
import Head from "next/head";

export default function DemographicsAnalysisPage() {
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [filter, setFilter] = useState({
    gender: "",
    age: "",
    emotion: "",
    ethnicity: "",
    start_date: "",
    end_date: "",
  });
  const [appliedFilter, setAppliedFilter] = useState<typeof filter>(filter);

  // Fetch all cameras for dropdown
  const { data: camerasData } = useCameras(1, 100);
  const cameras = camerasData?.items || [];

  // Only send start_date/end_date if not empty
  const filterForApi: any = { ...appliedFilter };
  if (!filterForApi.start_date) filterForApi.start_date = undefined;
  if (!filterForApi.end_date) filterForApi.end_date = undefined;

  // Fetch demographics results from API with auto-refresh every 30s
  const {
    data: demoResults,
    isLoading,
    isError,
    error,
    refetch: refetchDemo,
  } = useDemographicsResults(
    {
      camera_id: selectedCamera,
      ...filterForApi,
    },
    { refetchInterval: 30000 }
  );
  // Use items from API response, not results
  const results = demoResults?.items || [];

  // Analytics: Count by gender/ethnicity
  const genderCounts: Record<string, number> = {};
  const ethnicityCounts: Record<string, number> = {};
  results.forEach((r: any) => {
    if (r.gender)
      genderCounts[r.gender] = (genderCounts[r.gender] || 0) + r.count;
    if (r.ethnicity)
      ethnicityCounts[r.ethnicity] =
        (ethnicityCounts[r.ethnicity] || 0) + r.count;
  });

  return (
    <>
      <Head>
        <title>Demographics Analytics | Camera Dashboard</title>
        <meta
          name="description"
          content="Analyze demographics and camera analytics with real-time data and filters."
        />
        <meta
          property="og:title"
          content="Demographics Analytics | Camera Dashboard"
        />
        <meta
          property="og:description"
          content="Analyze demographics and camera analytics with real-time data and filters."
        />
        <meta property="og:type" content="website" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
          Demographics Results & Analytics
        </h1>
        <div className="flex flex-wrap gap-8 mb-10 items-end">
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              Select Camera:
            </label>
            <select
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
            >
              <option value="">Select</option>
              {cameras.map((cam: any) => (
                <option key={cam.id} value={cam.id}>
                  {cam.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              Filter by Gender:
            </label>
            <select
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={filter.gender}
              onChange={(e) =>
                setFilter((f) => ({ ...f, gender: e.target.value }))
              }
            >
              <option value="">All</option>
              {Object.values(Genders).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              Filter by Age:
            </label>
            <select
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={filter.age}
              onChange={(e) =>
                setFilter((f) => ({ ...f, age: e.target.value }))
              }
            >
              <option value="">All</option>
              {Object.values(Ages).map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              Filter by Emotion:
            </label>
            <select
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={filter.emotion}
              onChange={(e) =>
                setFilter((f) => ({ ...f, emotion: e.target.value }))
              }
            >
              <option value="">All</option>
              {Object.values(Emotions).map((em) => (
                <option key={em} value={em}>
                  {em}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              Filter by Ethnicity:
            </label>
            <select
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={filter.ethnicity}
              onChange={(e) =>
                setFilter((f) => ({ ...f, ethnicity: e.target.value }))
              }
            >
              <option value="">All</option>
              {Object.values(EthnicGroups).map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              Start Date:
            </label>
            <input
              type="datetime-local"
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={filter.start_date}
              onChange={(e) =>
                setFilter((f) => ({ ...f, start_date: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-pink-400 font-bold mb-2">
              End Date:
            </label>
            <input
              type="datetime-local"
              className="px-4 py-2 rounded bg-zinc-800 border border-pink-400 text-white"
              value={filter.end_date}
              onChange={(e) =>
                setFilter((f) => ({ ...f, end_date: e.target.value }))
              }
            />
          </div>
          <button
            className="h-12 px-8 rounded bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-bold shadow text-lg mt-6"
            onClick={() => setAppliedFilter(filter)}
            disabled={!selectedCamera}
          >
            Apply Filters
          </button>
        </div>
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
                <Skeleton className="w-2/3 h-8 mb-4" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-24 h-6" />
                    <Skeleton className="w-12 h-6" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
              <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
                <Skeleton className="w-2/3 h-8 mb-4" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-24 h-6" />
                    <Skeleton className="w-12 h-6" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
              <Skeleton className="w-1/2 h-8 mb-4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 mb-4">
                  <Skeleton className="w-24 h-6" />
                  <Skeleton className="w-24 h-6" />
                  <Skeleton className="w-24 h-6" />
                  <Skeleton className="w-24 h-6" />
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="text-center text-red-400 py-12 text-xl">
            {error?.message || "Failed to load demographics."}
          </div>
        ) : (
          <div className="bg-zinc-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-400 mb-4">
              Demographics Table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-lg border-separate border-spacing-0">
                <thead>
                  <tr>
                    {/* Camera column removed */}
                    <th className="px-4 py-2 border-b border-pink-400 text-yellow-400">
                      Age
                    </th>
                    <th className="px-4 py-2 border-b border-pink-400 text-yellow-400">
                      Gender
                    </th>
                    <th className="px-4 py-2 border-b border-pink-400 text-yellow-400">
                      Ethnicity
                    </th>
                    <th className="px-4 py-2 border-b border-pink-400 text-yellow-400">
                      Emotion
                    </th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-pink-300 py-8"
                      >
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    results.map((r: any, idx: number) => (
                      <tr key={idx}>
                        {/* Camera column removed */}
                        <td className="px-4 py-2 border-b border-zinc-700 text-white">
                          {r.age}
                        </td>
                        <td className="px-4 py-2 border-b border-zinc-700 text-white">
                          {r.gender}
                        </td>
                        <td className="px-4 py-2 border-b border-zinc-700 text-white">
                          {r.ethnicity}
                        </td>
                        <td className="px-4 py-2 border-b border-zinc-700 text-white">
                          {r.emotion}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
