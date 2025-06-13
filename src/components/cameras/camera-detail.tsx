'use client'

import Link from 'next/link'
import { Edit, Settings, BarChart } from 'lucide-react'

import type { Camera } from '@/lib/types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navbar } from '../navbar'

export const CameraDetail = ({ camera }: { camera: Camera }) => {
  return (
    <div className="space-y-6">
      <Navbar />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold sm:text-3xl">{camera.name}</h1>
          <p className="text-muted-foreground text-sm sm:text-base break-all">{camera.rtsp_url}</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={`/${camera.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              <span className="sm:inline">Edit Camera</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href={`/${camera.id}/demographics/config`}>
              <Settings className="mr-2 h-4 w-4" />
              <span className="sm:inline">Demographics Config</span>
            </Link>
          </Button>
          {camera.demographics_config && (
            <Button 
              size="sm" 
              asChild
              className="w-full sm:w-auto"
            >
              <Link href={`/${camera.id}/demographics/results`}>
                <BarChart className="mr-2 h-4 w-4" />
                <span className="sm:inline">View Analytics</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="details" className="text-xs sm:text-sm">Camera Details</TabsTrigger>
          <TabsTrigger value="config" className="text-xs sm:text-sm">Demographics Config</TabsTrigger>
        </TabsList>
        <TabsContent
          value="details"
          className="space-y-6 pt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Camera Information</CardTitle>
              <CardDescription>Technical details about this camera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Stream Settings</h3>
                  <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <dt className="text-muted-foreground text-sm font-medium">Resolution</dt>
                    <dd className="text-sm sm:text-base">
                      {camera.stream_frame_width || '-'}x{camera.stream_frame_height || '-'}
                    </dd>
                    <dt className="text-muted-foreground text-sm font-medium">FPS</dt>
                    <dd className="text-sm sm:text-base">{camera.stream_fps || '-'}</dd>
                    <dt className="text-muted-foreground text-sm font-medium">Quality</dt>
                    <dd className="text-sm sm:text-base">{camera.stream_quality || '-'}</dd>
                    <dt className="text-muted-foreground text-sm font-medium">Max Length</dt>
                    <dd className="text-sm sm:text-base">{camera.stream_max_length || '-'}</dd>
                    <dt className="text-muted-foreground text-sm font-medium">Skip Frames</dt>
                    <dd className="text-sm sm:text-base">{camera.stream_skip_frames || '-'}</dd>
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
                          className="text-xs"
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
                <CardTitle className="text-lg sm:text-xl">Demographics Configuration</CardTitle>
                <CardDescription>Current demographics processing settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-2 font-medium">Detection Settings</h3>
                    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <dt className="text-muted-foreground text-sm font-medium">Detection Confidence</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.detection_confidence_threshold || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Demographics Confidence</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.demographics_confidence_threshold || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Box Area Threshold</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.box_area_threshold || '-'}</dd>
                    </dl>
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium">Tracking Settings</h3>
                    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <dt className="text-muted-foreground text-sm font-medium">Track History Max Length</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.track_history_max_length || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Exit Threshold</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.exit_threshold || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Min Track Duration</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.min_track_duration || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Min Track Updates</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.min_track_updates || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Save Interval</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.save_interval || '-'}</dd>
                      <dt className="text-muted-foreground text-sm font-medium">Frame Skip Interval</dt>
                      <dd className="text-sm sm:text-base">{camera.demographics_config.frame_skip_interval || '-'}</dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">No Demographics Configuration</CardTitle>
                <CardDescription>This camera does not have demographics configuration set up yet.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full sm:w-auto">
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
