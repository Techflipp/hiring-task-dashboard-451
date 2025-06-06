import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 border-b">
          <div className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 w-32" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
