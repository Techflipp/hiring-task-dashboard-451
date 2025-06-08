import { Suspense } from "react"
import CameraList from "@/components/camera-list"
import { CameraListSkeleton } from "@/components/camera-skeletons"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Camera Management</h1>
      <Suspense fallback={<CameraListSkeleton />}>
        <CameraList />
      </Suspense>
    </main>
  )
}
