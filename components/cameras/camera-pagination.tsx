"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CameraPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export function CameraPagination({ currentPage, totalPages, totalItems, itemsPerPage }: CameraPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.push(`/cameras?${params.toString()}`)
  }

  const updateSize = (size: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("size", size)
    params.set("page", "1")
    router.push(`/cameras?${params.toString()}`)
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
          <span>
            Showing {startItem}-{endItem} of {totalItems} cameras
          </span>

          <div className="flex items-center space-x-2">
            <span>Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={updateSize}>
              <SelectTrigger className="w-16 sm:w-20 h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>

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
                onClick={() => updatePage(pageNum)}
                className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm ${
                  currentPage === pageNum ? "btn-gradient" : ""
                }`}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
