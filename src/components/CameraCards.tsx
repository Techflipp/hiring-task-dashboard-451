"use client";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { CloudAlert, Tags } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Camera } from "@/constants/apitypes";
import Spinner from "./Spinner";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CameraCard({
  id,
  snapshot,
  name,
  tags,
  is_active,
  created_at,
}: Camera) {
  const [imgError, setImgError] = useState<boolean>(false);
  const [ImgLoading, setImgLoading] = useState<boolean>(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      key={id}
      className="relative"
    >
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            <span>{new Date(created_at).toLocaleString()}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="relative h-[15rem] w-full">
            <div
              className={cn(
                "bg-accent absolute top-2 right-2 z-20 flex items-center gap-2 rounded-full px-2 text-sm font-semibold",
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
          </div>
          <div className="flex w-full flex-wrap items-center gap-2">
            {tags
              .slice(0, 3)
              .map((tag: { id: string; name: string; color: string }) => (
                <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                  <Tags />
                  {tag.name}
                </Badge>
              ))}

            {tags.length - 3 !== 0 && tags.length - 3 > 0 && (
              <Badge variant={"outline"}>+ {tags.length - 3} more</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/camera/${id}`}>
            <Button className="w-full" variant={"secondary"}>
              View Details
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
