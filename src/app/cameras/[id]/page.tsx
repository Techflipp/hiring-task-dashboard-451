"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CameraDemographicsConfigForm from "./CameraDemographicsConfigForm/page";
import API from "@/app/axios/axios";
import AppSpinner from "../../../../public/components/AppSpinner/AppSpinner";
interface props {
  name: string;
  id: string;
  color: string;
}

export default function CameraDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["camera", id],
    queryFn: async () => {
      const res = await API.get(`cameras/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div>
        {" "}
        <AppSpinner />
      </div>
    );
  if (error) return <p>Error loading camera data.</p>;

  const camera = data;

  return (
    <div className="p-6 w-full">
      <div className=" flex justify-between items-center">
        {" "}
        <h1 className="text-2xl font-bold mb-4">Camera Details</h1>
        <Link href={`/cameras/${camera.id}/demographics-results`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          DemographicsResults
        </Link>
      </div>
      <img src={camera.snapshot} alt={camera.name} className="w-[90%] h-[500px] object-cover rounded" />
      <div className="grid  md:grid-cols-2 w-full gap-4">
        <div>
          <strong>Name:</strong> {camera.name}
        </div>
        <div>
          <strong>RTSP URL:</strong> {camera.rtsp_url}
        </div>
        <div>
          <strong>Status:</strong>{" "}
          {camera.is_active ? <span className="text-green-600">Active</span> : <span className="text-red-600">{camera.status_message}</span>}
        </div>
        <div>
          <strong>Created At:</strong> {new Date(camera.created_at).toLocaleDateString()}
        </div>
        <div className="md:col-span-2">
          <strong>Tags:</strong>{" "}
          {camera.tags?.length > 0 ? (
            <div className="flex gap-2 flex-wrap mt-1">
              {camera.tags.map((tag: props) => (
                <span key={tag.id} className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </span>
              ))}
            </div>
          ) : (
            <span>No tags</span>
          )}
        </div>

        {camera?.demographics_config && <CameraDemographicsConfigForm cameraId={camera.id} existingConfig={camera.demographics_config} />}
        {!camera?.demographics_config && <CameraDemographicsConfigForm cameraId={camera.id} />}
      </div>
    </div>
  );
}
