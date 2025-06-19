import { Camera } from '@/types/camera.interface'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const CameraCard = ({ camera }: { camera: Camera }) => {
  return (
    <Card className="overflow-hidden">
      <Image
        src={camera.snapshot}
        alt={camera.name}
        width={400}
        height={240}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{camera.name}</CardTitle>
          <Badge variant={camera.is_active ? 'success' : 'destructive'}>
            {camera.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{camera.status_message}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {camera.tags.map((tag) => (
            <Badge
              key={tag.id}
              style={{
                backgroundColor: tag.color,
                color: '#000',
              }}
              className="capitalize"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
        <Link
          href={`/cameras/${camera.id}`}
          className="text-sm text-primary hover:underline inline-block"
        >
          View Details →
        </Link>
      </CardContent>
    </Card>
  )
}
