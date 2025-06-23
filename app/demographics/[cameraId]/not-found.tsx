import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Camera Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The camera you're looking for doesn't exist or doesn't have demographics configuration enabled.
          </p>
          <Link href="/demographics">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demographics
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
