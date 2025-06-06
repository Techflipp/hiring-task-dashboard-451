"use client";
import { getCameras } from "@/services";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DynamicPagination from "./DynamicPagination";
import { Skeleton } from "./ui/skeleton";
import CameraCard from "./CameraCard";
import { useRouter, useSearchParams } from "next/navigation";
import { getCamerasResponse } from "@/constants/apitypes";

export default function CamerasList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = searchParams.get("size")
    ? parseInt(searchParams.get("size") as string)
    : 20;
  const camName = searchParams.get("search");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch, isFetching } = useQuery<
    getCamerasResponse,
    Error
  >({
    queryKey: ["cameras", { page: currentPage }],
    queryFn: () => getCameras(camName, currentPage, pageSize),
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (isFetching) {
      params.set("search", camName || "");
      params.set("page", currentPage.toString() || "1");
      params.set("size", pageSize.toString());
      router.push(`?${params.toString()}`);
    }
    if (data?.items.length === 0) {
      params.set("search", "");
      params.set("page", "1");
      params.set("size", "20");
      router.push(`?${params.toString()}`);
    }
  }, [
    isFetching,
    router,
    searchParams,
    currentPage,
    pageSize,
    camName,
    data?.items.length,
  ]);
  return (
    <div className="w-full max-container p-4 py-10 ">
      <DynamicPagination
        totalPages={data?.pages || 1}
        dynamicPage={currentPage}
        setDynamicPage={setCurrentPage}
        refetch={refetch}
      />
      <div className="grid grid-cols-1 w-full xl:grid-cols-2 gap-4 ">
        {data?.items.length === 0 && !isFetching && !isLoading ? (
          <div className="h-svh w-full text-white text-center relative flex-center text-4xl">
            No cameras found, use a different size{" "}
          </div>
        ) : null}
        {isLoading
          ? [...Array(pageSize).keys()].map((i, index) => (
              <div className="flex flex-col space-y-3" key={index}>
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))
          : data?.items.map((item) => <CameraCard key={item.id} {...item} />)}
      </div>
    </div>
  );
}
