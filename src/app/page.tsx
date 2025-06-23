
// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//         kjfghjkm njk
//     </div>
//   );
// }


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, BarChart3, Settings, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Camera Management Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your camera network and analyze demographic data with powerful insights and analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cameras</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View & Manage</div>
            <p className="text-xs text-muted-foreground">Browse and configure your cameras</p>
            <Link href="/cameras">
              <Button className="w-full mt-4" variant="outline">
                Go to Cameras
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Demographics</div>
            <p className="text-xs text-muted-foreground">View demographic insights</p>
            <Link href="/analytics">
              <Button className="w-full mt-4" variant="outline">
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuration</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Settings</div>
            <p className="text-xs text-muted-foreground">Configure demographics tracking</p>
            <Link href="/cameras">
              <Button className="w-full mt-4" variant="outline">
                Configure
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Real-time</div>
            <p className="text-xs text-muted-foreground">Live demographic data</p>
            <Link href="/analytics">
              <Button className="w-full mt-4" variant="outline">
                View Insights
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What you can do with this application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Camera className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Camera Management</h4>
                <p className="text-sm text-muted-foreground">View, search, and update camera configurations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Settings className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Demographics Configuration</h4>
                <p className="text-sm text-muted-foreground">Configure tracking parameters for each camera</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Analytics & Insights</h4>
                <p className="text-sm text-muted-foreground">Visualize demographic data with charts and filters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with camera management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Browse Cameras</h4>
              <p className="text-sm text-muted-foreground">
                Start by viewing your camera list and searching for specific cameras
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Configure Settings</h4>
              <p className="text-sm text-muted-foreground">Update camera details and set up demographics tracking</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. View Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Analyze demographic data with powerful filtering and visualization tools
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
