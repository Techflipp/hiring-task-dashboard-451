'use client'

import { useCameras } from '@/hooks/useCamera'
import { CameraCard } from './CameraCard'
import { CameraSearchBar } from './CameraSearchBar'
import { CameraPagination } from './CameraPagination'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/Skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert'

export const CameraList = () => {
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1')
  const size = parseInt(searchParams.get('size') || '5')
  const camera_name = searchParams.get('search') || ''

  const { data, isLoading, isError } = useCameras({ page, size, camera_name })

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded" />
        ))}
      </div>
    )

  if (isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Fetch Error</AlertTitle>
        <AlertDescription>Unable to load cameras. Please try again.</AlertDescription>
      </Alert>
    )

  return (
    <div className="space-y-6">
      <CameraSearchBar defaultValue={camera_name} pageSize={size} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
        {data?.items.map((camera) => (
          <CameraCard key={camera.id} camera={camera} />
        ))}
      </div>

      <CameraPagination
        page={data?.page || 1 }
        pages={data?.pages || 1}
        search={camera_name}
        size={size}
      />
    </div>
  )
}
