import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Filter section skeleton */}
      <div className="bg-card rounded-lg border p-4 shadow-sm">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Charts section skeleton */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    </div>
  )
} 