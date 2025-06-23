"use client"

import { useQuery } from "@tanstack/react-query"
import { camerasApi } from "@/lib/api"
import { CameraDetails } from "@/components/camera-details"
import { CameraDetailsSkeleton } from "@/components/camera-details-skeleton"
import { ErrorMessage } from "@/components/error-message"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import * as React from "react"

export default function CameraDetailPage() {
  // ✅ Get the params directly from useParams()
  const params = useParams() as { id: string }

  const {
    data: camera,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["camera", params.id],
    queryFn: () => camerasApi.getById(params.id),
  })

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/cameras">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cameras
          </Button>
        </Link>
        <ErrorMessage
          title="Failed to load camera details"
          message="There was an error loading the camera information. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/cameras">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cameras
        </Button>
      </Link>

      {isLoading ? <CameraDetailsSkeleton /> : camera ? <CameraDetails camera={camera} /> : null}
    </div>
  )
}
