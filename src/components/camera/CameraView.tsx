"use client";
import {
  getCameraByIdResponse,
  getDemoGraphicsResultsResponse,
} from "@/constants/apitypes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getCameraById, getDemographicsResults } from "@/services";
import { Button } from "@/components/ui/button";

import { Skeleton } from "@/components/ui/skeleton";
import DemoGraphicLine from "./DemoGraphicLine";
import Details from "../Details";
import DemoGraphicArea from "./DemoGraphicArea";
import DemoGraphicCircle from "./DemoGraphicsCircle";

export default function CameraView({ id }: { id: string }) {
  const camId = id;

  const { data } = useQuery<getCameraByIdResponse, Error>({
    queryKey: ["camera"],
    queryFn: () => getCameraById(camId),
  });

  const { data: demoGraphicResult, isError: graphError } = useQuery<
    getDemoGraphicsResultsResponse,
    Error
  >({
    queryKey: ["demographics"],
    queryFn: () => getDemographicsResults({ camera_id: camId }),
  });

  if (!data) {
    return (
      <div className="flex-center flex size-full">
        <h2 className="text-3xl font-bold">please wait</h2>
      </div>
    );
  }

  return (
    <div className="flex-center h-full w-full flex-col gap-5 xl:flex-row">
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex h-full w-full">
          <div className="flex h-full w-full flex-col gap-2">
            <span className="text-xs">{data?.id}</span>
            <h3 className="text-4xl font-bold">{data?.name}</h3>

            <div
              className={cn(
                "flex items-center gap-2 text-xl font-semibold",
                data?.is_active ? "text-green-500" : "text-red-500",
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  data?.is_active
                    ? "bg-green-500 shadow-[0px_0px_10px_3px_rgba(11,241,176,0.9)]"
                    : "bg-red-500 shadow-[0px_0px_10px_3px_rgba(184,80,20,0.9)]",
                )}
              />
              {data?.is_active ? "Active" : "Inactive"}
            </div>
            <span className="text-gray-900">
              {data?.status_message || "No description available"}
            </span>

            <span className="text-gray-900">{data?.rtsp_url}</span>
          </div>
        </div>
        <div className="w-full">
          <h3 className="text-2xl font-semibold">Tags</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {data?.tags?.map(
              (tag: { id: string; name: string; color: string }) => (
                <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </Badge>
              ),
            )}
          </div>
        </div>
        <div className="h-full w-full">
          <h3 className="text-2xl font-semibold">Camera details</h3>
          <div className="flex h-full flex-col gap-4">
            <span>{`Resolution:${data?.stream_frame_width}*${data?.stream_frame_height}`}</span>
            <span>{`FPS:${data?.stream_fps}`}</span>
            <span>{`Skipped Frames:${data?.stream_skip_frames}`}</span>
            <span>{`Quality:${data?.stream_quality}%`}</span>
            <span>{`Length:${data?.stream_max_length}m`}</span>
            <span>{`Created At:${new Date(
              data?.created_at as string,
            ).toLocaleString()}`}</span>
            <span>{`Updated At:${new Date(
              data?.updated_at as string,
            ).toLocaleString()}`}</span>
          </div>
        </div>
        <div className="mt-auto flex w-full flex-col gap-4 lg:flex-row">
          <Details form="camera" camId={id}>
            <Button>Edit Camera</Button>
          </Details>
          <Details form="demographics" camId={id}>
            <Button>Edit Demographics</Button>
          </Details>
        </div>
      </div>

      <div className="relative grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
        {!graphError && demoGraphicResult?.analytics ? (
          <>
            <DemoGraphicLine
              item={Object.keys(demoGraphicResult.analytics)[0]}
              analytics={demoGraphicResult.analytics}
              date={demoGraphicResult.items[0].created_at}
            />
            <DemoGraphicCircle
              item={Object.keys(demoGraphicResult.analytics)[1]}
              analytics={demoGraphicResult.analytics}
              date={demoGraphicResult.items[0].created_at}
            />
            <DemoGraphicCircle
              item={Object.keys(demoGraphicResult.analytics)[2]}
              analytics={demoGraphicResult.analytics}
              date={demoGraphicResult.items[0].created_at}
            />
            <DemoGraphicArea
              item={Object.keys(demoGraphicResult.analytics)[3]}
              analytics={demoGraphicResult.analytics}
              date={demoGraphicResult.items[0].created_at}
            />
          </>
        ) : (
          [...Array(4).keys()].map((i, index) => (
            <div className="flex flex-col space-y-3" key={index}>
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
