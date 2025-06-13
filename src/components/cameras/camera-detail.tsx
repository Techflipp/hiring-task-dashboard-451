'use client'

import Link from 'next/link'
import { Edit, Settings, BarChart, ArrowLeft } from 'lucide-react'

import type { Camera } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const CameraDetail = ({ camera }: { camera: Camera }) => {
  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        className="w-fit"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Cameras
        </Link>
      </Button>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{camera.name}</h1>
            <p className="text-muted-foreground mt-1">{camera.rtsp_url}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            asChild
          >
            <Link href={`/${camera.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Camera
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <Link href={`/${camera.id}/demographics/config`}>
              <Settings className="mr-2 h-4 w-4" />
              Demographics Config
            </Link>
          </Button>
          {camera.demographics_config && (
            <Button asChild>
              <Link href={`/${camera.id}/demographics/results`}>
                <BarChart className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Camera Details</TabsTrigger>
          <TabsTrigger value="config">Demographics Config</TabsTrigger>
        </TabsList>
        <TabsContent
          value="details"
          className="space-y-6 pt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Camera Information</CardTitle>
              <CardDescription>Technical details about this camera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Stream Settings</h3>
                  <dl className="grid grid-cols-2 gap-2">
                    <dt className="text-muted-foreground text-sm font-medium">Resolution</dt>
                    <dd>
                      {camera.stream_frame_width || '-'}x{camera.stream_frame_height || '-'}
                    </dd>
                    <dt className="text-muted-foreground text-sm font-medium">FPS</dt>
                    <dd>{camera.stream_fps || '-'}</dd>
                    <dt className="text-muted-foreground text-sm font-medium">Quality</dt>
                    <dd>{camera.stream_quality || '-'}</dd>
                    <dt className="text-muted-foreground text-sm font-medium">Max Length</dt>
                    <dd>{camera.stream_max_length || '-'}</dd>
                    <dt className="text-muted-foreground text-sm font-medium">Skip Frames</dt>
                    <dd>{camera.stream_skip_frames || '-'}</dd>
                  </dl>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Tags</h3>
                  {camera.tags && camera.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {camera.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No tags assigned</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent
          value="config"
          className="space-y-6 pt-4"
        >
          {camera.demographics_config ? (
            <Card>
              <CardHeader>
                <CardTitle>Demographics Configuration</CardTitle>
                <CardDescription>Current demographics processing settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-medium">Detection Settings</h3>
                    <dl className="grid grid-cols-2 gap-2">
                      <dt className="text-muted-foreground text-sm font-medium">Detection Confidence</dt>
                      <dd>{camera.demographics_config.detection_confidence_threshold || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Demographics Confidence</dt>
                      <dd>{camera.demographics_config.demographics_confidence_threshold || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Box Area Threshold</dt>
                      <dd>{camera.demographics_config.box_area_threshold || '-'}</dd>
                    </dl>
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium">Tracking Settings</h3>
                    <dl className="grid grid-cols-2 gap-2">
                      <dt className="text-muted-foreground text-sm font-medium">Track History Max Length</dt>
                      <dd>{camera.demographics_config.track_history_max_length || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Exit Threshold</dt>
                      <dd>{camera.demographics_config.exit_threshold || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Min Track Duration</dt>
                      <dd>{camera.demographics_config.min_track_duration || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Min Track Updates</dt>
                      <dd>{camera.demographics_config.min_track_updates || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Save Interval</dt>
                      <dd>{camera.demographics_config.save_interval || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Frame Skip Interval</dt>
                      <dd>{camera.demographics_config.frame_skip_interval || '-'}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Demographics Configuration</CardTitle>
                <CardDescription>This camera does not have demographics configuration set up yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/${camera.id}/demographics/config`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Create Configuration
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
