import { Skeleton } from "./ui/skeleton";

//simple skeleton loading state

export default function CamerasListSkeleton({ size }: { size: number | null }) {
  return [...Array(size ? size : 50).keys()].map((i, index) => (
    <div className="flex flex-col space-y-3" key={index}>
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ));
}
