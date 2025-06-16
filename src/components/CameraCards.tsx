"use client";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tags } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Camera } from "@/constants/apitypes";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AsyncImage from "./AsyncImage";

export default function CameraCard({
  id,
  snapshot,
  name,
  tags,
  is_active,
  created_at,
}: Camera) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      key={id}
      className="relative h-full w-full"
    >
      <Card className="h-full w-full">
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
            <AsyncImage snapshot={snapshot} name={name} />
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
        <CardFooter className="mt-auto">
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
