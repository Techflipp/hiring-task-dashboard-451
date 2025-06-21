"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AnalyticsTableProps {
  data: any[]
}

export function AnalyticsTable({ data }: AnalyticsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-green-100 text-green-800",
      neutral: "bg-gray-100 text-gray-800",
      sad: "bg-blue-100 text-blue-800",
      angry: "bg-red-100 text-red-800",
      surprise: "bg-yellow-100 text-yellow-800",
      fear: "bg-purple-100 text-purple-800",
    }
    return colors[emotion] || "bg-gray-100 text-gray-800"
  }

  const getGenderColor = (gender: string) => {
    return gender === "male" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
  }

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Detection Records</h3>
        <div className="text-xs sm:text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} records
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                Timestamp
              </th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                Gender
              </th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                Age
              </th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                Emotion
              </th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                Ethnicity
              </th>
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-900">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-white/50">
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                  {new Date(record.timestamp).toLocaleString()}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4">
                  <Badge className={`text-xs ${getGenderColor(record.gender)}`}>
                    {record.gender.charAt(0).toUpperCase() + record.gender.slice(1)}
                  </Badge>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">{record.age}</td>
                <td className="py-2 sm:py-3 px-2 sm:px-4">
                  <Badge className={`text-xs ${getEmotionColor(record.emotion)}`}>
                    {record.emotion.charAt(0).toUpperCase() + record.emotion.slice(1)}
                  </Badge>
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                  {record.ethnicity.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </td>
                <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900">
                  {(record.confidence * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 sm:mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${
                    currentPage === pageNum ? "btn-gradient" : ""
                  }`}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
