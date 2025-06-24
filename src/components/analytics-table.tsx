"use client"

import { useState } from "react"
import type { DemographicsResult } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatEnumValue } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AnalyticsTableProps {
  data: DemographicsResult[]
}

export function AnalyticsTable({ data }: AnalyticsTableProps) {
  // Ensure data is an array and provide fallback
  const validData = Array.isArray(data) ? data : []

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(validData.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = validData.slice(startIndex, endIndex)

  // Early return if no data
  if (validData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Detection Results</CardTitle>
          <CardDescription>No demographic detection results available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a camera and adjust filters to view detection results.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: "bg-green-100 text-green-800",
      sad: "bg-blue-100 text-blue-800",
      angry: "bg-red-100 text-red-800",
      fear: "bg-purple-100 text-purple-800",
      surprise: "bg-yellow-100 text-yellow-800",
      neutral: "bg-gray-100 text-gray-800",
    }
    return colors[emotion as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800"
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Results</CardTitle>
        <CardDescription>
          Detailed view of demographic detection results ({validData.length} total records)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Emotion</TableHead>
                <TableHead>Ethnicity</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono text-sm">{formatDate(result.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatEnumValue(result.gender)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.age}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getEmotionColor(result.emotion)}>{formatEnumValue(result.emotion)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{formatEnumValue(result.ethnicity)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getConfidenceColor(result.confidence)}>
                      {(result.confidence * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, validData.length)} of {validData.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
