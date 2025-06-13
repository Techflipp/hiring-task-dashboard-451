import { Skeleton } from '../ui/skeleton'

export const FormSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-24" />
      <div className="flex justify-end gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
