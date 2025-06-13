"use client";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { CloudAlert } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Camera } from "@/constants/apitypes";
import Spinner from "./Spinner";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

export default function CameraCard({
  id,
  snapshot,
  name,
  tags,
  is_active,
}: Camera) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [ImgLoading, setImgLoading] = useState<boolean>(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      key={id}
      className="relative flex h-[30rem] w-full flex-col items-start justify-end gap-6 rounded-2xl border-1 bg-stone-200 p-2 text-white shadow-xl transition-shadow"
    >
      <div className="absolute top-0 left-0 z-0 h-full w-full">
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
            className="w-full rounded-xl object-cover"
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
      </div>
      <div className="glassBg relative z-10 flex w-full flex-col gap-4">
        <h2 className="text-2xl font-extrabold">{name}</h2>
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              "flex items-center gap-2 text-xl font-semibold",
              is_active ? "text-green-500" : "text-red-500",
            )}
          >
            <div
              className={cn(
                "size-2 rounded-full font-medium",
                is_active
                  ? "bg-green-500 shadow-[0px_0px_10px_3px_rgba(11,241,176,0.9)]"
                  : "bg-red-500 shadow-[0px_0px_10px_3px_rgba(184,80,20,0.9)]",
              )}
            />
            {is_active ? "Active" : "Inactive"}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full flex-wrap items-center gap-2">
            {tags
              .slice(0, 3)
              .map((tag: { id: string; name: string; color: string }) => (
                <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </Badge>
              ))}

            {tags.length - 3 !== 0 && tags.length - 3 > 0 && (
              <Badge className="bg-white">+ {tags.length - 3} more</Badge>
            )}
          </div>
        </div>
        <Link href={`/camera/${id}`}>
          <Button className="mx-auto mt-auto w-full max-w-sm">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
