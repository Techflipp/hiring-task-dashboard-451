"use client";
import Image from "next/image";

import { useState } from "react";
import { CloudAlert } from "lucide-react";

import Spinner from "./Spinner";
import { Skeleton } from "./ui/skeleton";

export default function AsyncImage({
  snapshot,
  name,
}: {
  snapshot: string;
  name: string;
}) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [ImgLoading, setImgLoading] = useState<boolean>(true);
  return (
    <>
      {ImgLoading && !imgError && (
        <Skeleton className="flex-center flex h-full w-full flex-col gap-2">
          <Spinner />
          <span>Loading Image</span>
        </Skeleton>
      )}
      {!imgError ? (
        <Image
          fill={true}
          src={snapshot}
          alt={name}
          className="w-full rounded-md"
          onLoad={() => setImgLoading(false)}
          onError={() => setImgError(true)}
          priority
        />
      ) : (
        <div className="z-20 flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-slate-700">
          <CloudAlert size={40} />
          <span>NO IMAGE</span>
        </div>
      )}
    </>
  );
}
