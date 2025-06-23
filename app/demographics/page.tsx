import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCameras } from "@/lib/api"
import Link from "next/link"
import { Camera, BarChart3 } from "lucide-react"

async function CamerasList() {
  try {
    const response = await getCameras({ page: 1, size: 100 })
    const camerasWithAnalytics = response.items.filter((camera: any) => camera.demographics_config)

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {camerasWithAnalytics.map((camera: any) => (
          <Link key={camera.id} href={`/demographics/${camera.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  {camera.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">View Analytics</span>
                  <BarChart3 className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load cameras</p>
          </div>
        </CardContent>
      </Card>
    )
  }
}

export default function DemographicsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Demographics Analytics</h1>
        <p className="text-muted-foreground mt-2">Select a camera to view demographic analytics data</p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <CamerasList />
      </Suspense>
    </div>
  )
}
