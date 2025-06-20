"use client";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useCameraDetail } from "@/hooks/useCameraDetails";

export const CameraDetail = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useCameraDetail(id);
  const router = useRouter();

  if (isLoading) return <Skeleton className="h-48 w-full rounded-lg" />;
  if (error || !data)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load camera details.</AlertDescription>
      </Alert>
    );

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
    <Card className="max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {name}
          <Button onClick={() => router.push(`/cameras/${id}/edit`)}>
            Edit Camera
          </Button>
          <Button onClick={() => router.push(`/cameras/${id}/configure`)}>
            Configure
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <img src={snapshot} alt={name} className="w-full rounded-md border" />

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">RTSP URL:</p>
          <p className="font-mono">{rtsp_url}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
              {tag.name}
            </Badge>
          ))}
        </div>

        <p
          className={`text-sm font-medium ${
            is_active ? "text-green-600" : "text-red-600"
          }`}
        >
          {status_message}
        </p>

        <p className="text-xs text-muted-foreground">
          Created: {new Date(created_at).toLocaleString()} <br />
          Updated: {new Date(updated_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};
