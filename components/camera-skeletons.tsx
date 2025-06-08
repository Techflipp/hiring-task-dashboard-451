import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CameraListSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <div className="h-10 border-b px-4 flex items-center">
            <Skeleton className="h-4 w-24 mr-auto" />
            <Skeleton className="h-4 w-24 mr-auto" />
            <Skeleton className="h-4 w-24 mr-auto" />
            <Skeleton className="h-4 w-24 mr-auto" />
            <Skeleton className="h-4 w-24" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b px-4 flex items-center">
              <Skeleton className="h-4 w-32 mr-auto" />
              <Skeleton className="h-4 w-40 mr-auto" />
              <Skeleton className="h-4 w-20 mr-auto" />
              <Skeleton className="h-6 w-24 mr-auto" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Skeleton className="h-10 w-64" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CameraDetailsSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function DemographicsResultsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 flex-1" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export function CameraFormSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
          <div className="col-span-full space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ConfigFormSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  )
}
