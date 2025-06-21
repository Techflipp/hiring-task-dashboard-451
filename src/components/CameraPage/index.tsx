"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCameras } from "@/services/cameras";
import CustomTable from "@/components/CustomTable";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import AppSpinner from "@/components/AppSpinner/AppSpinner";
import React from "react";

type CameraItem = {
  id: string;
  name: string;
  snapshot: string;
  rtsp_url: string;
  is_active: boolean;
  status_message: string;
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
  created_at: string;
};

type CamerasResponse = {
  items: CameraItem[];
  total: number;
};

export default function CamerasPage({ serverData= { items: [], total: 0} }: { serverData: CamerasResponse }) {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  const { data, isLoading } = useQuery<CamerasResponse, Error>({
    queryKey: ["cameras", page, size, search],
    queryFn: () => getCameras(page, size, search),
    placeholderData: (previousData) => previousData,
    initialData: serverData,
  });

  const totalPages = Math.ceil((data?.total || 1) / size);
  const cameras: CameraItem[] = data?.items || [];

  const columns = [
    {
      key: "snapshot",
      label: "Snapshot",
      render: (item: CameraItem) => <img src={item.snapshot} alt={item.name} className="w-20 h-12 object-cover rounded" />,
    },
    {
      key: "name",
      label: "Camera Name",
      render: (item: CameraItem) => (
        <Link href={`/cameras/${item.id}`} className="text-blue-600 cursor-pointer underline">
          {item.name}
        </Link>
      ),
    },
    {
      key: "rtsp_url",
      label: "RTSP URL",
      render: (item: CameraItem) => item.rtsp_url,
    },
    {
      key: "status_message",
      label: "Status",
      render: (item: CameraItem) =>
        item.is_active ? (
          <span className="text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-red-600 font-medium">{item.status_message}</span>
        ),
    },
    {
      key: "tags",
      label: "Tags",
      render: (item: CameraItem) => (
        <div className="flex gap-1 flex-wrap">
          {item.tags?.map((tag) => (
            <span key={tag.id} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: tag.color, color: "#fff" }}>
              {tag.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (item: CameraItem) => new Date(item.created_at).toLocaleDateString("en-GB"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: CameraItem) => (
        <Link href={`/cameras/${item.id}/edit`} className="cursor-pointer underline">
          Edit
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cameras</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search cameras..."
        className="border border-gray-200 px-4 py-2 rounded mb-4 w-full max-w-sm"
      />

      {isLoading ? (
        <AppSpinner />
      ) : (
        <>
          <CustomTable  columns={columns} data={cameras} showActions={false} />
          <Pagination
            page={page}
            totalPages={totalPages}
            size={size}
            onPageChange={(newPage) => setPage(newPage)}
            onSizeChange={(newSize) => setSize(newSize)}
          />
        </>
      )}
    </div>
  );
}
