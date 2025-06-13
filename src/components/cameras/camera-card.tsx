import Link from 'next/link'
import { Edit, Eye, Settings } from 'lucide-react'

import type { Camera } from '@/lib/types'
import { getInitials, truncateText } from '@/lib/utils'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function CameraCard({ camera }: { camera: Camera }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getInitials(camera.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{truncateText(camera.name, 30)}</CardTitle>
          <div className="mt-2 flex flex-wrap gap-1">
            {camera.tags?.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-muted-foreground text-sm">
          <p className="truncate">{camera.rtsp_url}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <p className="text-muted-foreground text-xs">Resolution</p>
              <p>
                {camera.stream_frame_width || '-'}x{camera.stream_frame_height || '-'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">FPS</p>
              <p>{camera.stream_fps || '-'}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/cameras/${camera.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/cameras/${camera.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/cameras/${camera.id}/demographics/config`}>
            <Settings className="mr-2 h-4 w-4" />
            Config
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
