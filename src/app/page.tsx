import { Suspense } from "react";
import FilterProps from "./components/filter-props";
import CameraList from "./components/camera-list";
import CameraListSkeleton from "./components/camera-list-skeleton";

type Props = {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    size?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const page = Number(resolvedSearchParams?.page) || 1;
  const size = Number(resolvedSearchParams?.size) || 5;

  return (
    <main className="container w-full min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Camera Management</h1>
        <FilterProps />
      </div>

      <Suspense
        key={search + page + size}
        fallback={<CameraListSkeleton size={size} />}
      >
        <CameraList search={search} page={page} size={size} />
      </Suspense>
    </main>
  );
}
