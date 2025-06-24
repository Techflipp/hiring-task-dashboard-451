"use client"

import { useState } from "react"
import type { Camera } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraUpdateForm } from "./camera-update-form"
import { DemographicsConfigForm } from "./demographics-config-form"
import { formatDate } from "@/lib/utils"
import { CameraIcon, Settings, BarChart3, Tag } from "lucide-react"

interface CameraDetailsProps {
  camera: Camera
}

export function CameraDetails({ camera }: CameraDetailsProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <CameraIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{camera.name}</h1>
            {camera.demographics_config && <Badge variant="secondary">Analytics Enabled</Badge>}
          </div>
          <p className="text-muted-foreground">{camera.rtsp_url}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <CameraIcon className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Stream Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Resolution</span>
                    <p className="font-medium">
                      {camera.stream_frame_width && camera.stream_frame_height
                        ? `${camera.stream_frame_width} × ${camera.stream_frame_height}`
                        : "Not configured"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Frame Rate</span>
                    <p className="font-medium">{camera.stream_fps ? `${camera.stream_fps} FPS` : "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Quality</span>
                    <p className="font-medium">{camera.stream_quality ? `${camera.stream_quality}%` : "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Max Length</span>
                    <p className="font-medium">
                      {camera.stream_max_length ? `${camera.stream_max_length}s` : "Not set"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Skip Frames</span>
                    <p className="font-medium">{camera.stream_skip_frames || "None"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags & Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Tags</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {camera.tags && camera.tags.length > 0 ? (
                      camera.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline">
                          {tag.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags assigned</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Created</span>
                    <p className="font-medium">{formatDate(camera.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <p className="font-medium">{formatDate(camera.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {camera.demographics_config && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Demographics Configuration
                </CardTitle>
                <CardDescription>Current analytics settings for this camera</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Track History Length</span>
                    <p className="font-medium">{camera.demographics_config.track_history_max_length || "Default"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Exit Threshold</span>
                    <p className="font-medium">{camera.demographics_config.exit_threshold || "Default"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Min Track Duration</span>
                    <p className="font-medium">{camera.demographics_config.min_track_duration || "Default"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Detection Confidence</span>
                    <p className="font-medium">
                      {camera.demographics_config.detection_confidence_threshold || "Default"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Demographics Confidence</span>
                    <p className="font-medium">
                      {camera.demographics_config.demographics_confidence_threshold || "Default"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Save Interval</span>
                    <p className="font-medium">
                      {camera.demographics_config.save_interval
                        ? `${camera.demographics_config.save_interval}s`
                        : "Default"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <CameraUpdateForm camera={camera} />
        </TabsContent>

        <TabsContent value="demographics">
          <DemographicsConfigForm camera={camera} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
