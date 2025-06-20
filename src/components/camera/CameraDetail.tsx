"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCameraDetail } from "@/hooks/useCameraDetails";
import { EyeIcon, PencilIcon, SlidersHorizontalIcon } from "lucide-react";

export const CameraDetail = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useCameraDetail(id);
  const router = useRouter();

  if (isLoading)
    return (
      <Card className="max-w-5xl mx-auto mt-6 p-6">
        <Skeleton className="h-64 w-full rounded-xl" />
      </Card>
    );

  if (error || !data) {
    return (
      <Alert variant="destructive" className="mt-6 max-w-3xl mx-auto">
        <AlertDescription>Failed to load camera details.</AlertDescription>
      </Alert>
    );
  }

  const {
    name,
    rtsp_url,
    tags,
    snapshot,
    is_active,
    status_message,
    created_at,
    updated_at,
  } = data;

  return (
    <Card className="max-w-6xl mx-auto mt-6 rounded-2xl shadow-lg border">
      <CardHeader className="border-b p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-3xl font-bold">{name}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Unique ID: {id}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/cameras/${id}/edit`)}
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/cameras/${id}/configure`)}
          >
            <SlidersHorizontalIcon className="h-4 w-4 mr-1" />
            Configure
          </Button>
          <Button onClick={() => router.push(`/cameras/${id}/analytics`)}>
            <EyeIcon className="h-4 w-4 mr-1" />
            Analytics
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Snapshot */}
        <div className="overflow-hidden rounded-xl border shadow-sm">
          <img
            src={snapshot}
            alt={name}
            className="object-cover w-full h-full aspect-video"
          />
        </div>

        {/* Metadata */}
        <div className="space-y-6">
          <section>
            <p className="text-sm text-muted-foreground mb-1">RTSP URL</p>
            <p className="font-mono text-sm bg-muted p-2 rounded break-all">
              {rtsp_url}
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground mb-1">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color }}
                    className="text-white"
                  >
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </section>

          <section>
            <p
              className={`text-sm font-semibold ${
                is_active ? "text-green-600" : "text-red-600"
              }`}
            >
              {status_message}
            </p>
          </section>

          <section className="text-xs text-muted-foreground space-y-1">
            <p>Created: {new Date(created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(updated_at).toLocaleString()}</p>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};
