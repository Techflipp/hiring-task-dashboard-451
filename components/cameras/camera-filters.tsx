"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

export function CameraFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("camera_name") || "")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "all",
    hasConfig: searchParams.get("hasConfig") || "all",
    sortBy: searchParams.get("sortBy") || "name",
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    if (search) {
      params.set("camera_name", search)
    } else {
      params.delete("camera_name")
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.set("page", "1")
    router.push(`/cameras?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = new URLSearchParams(searchParams)

    if (search) {
      params.set("camera_name", search)
    } else {
      params.delete("camera_name")
    }

    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== "all") {
        params.set(k, v)
      } else {
        params.delete(k)
      }
    })

    params.set("page", "1")
    router.push(`/cameras?${params.toString()}`)
  }

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search cameras by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-white/50 border-white/20 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
            />
          </div>
        </form>

        <div className="flex gap-2 sm:gap-3">
          <Button
            type="submit"
            onClick={handleSearch}
            className="btn-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base"
          >
            Search
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-white/20 bg-white/50 hover:bg-white/80 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="mt-4 p-4 bg-white/30 rounded-xl border border-white/20">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="text-sm bg-white/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Has Config</label>
              <Select value={filters.hasConfig} onValueChange={(value) => handleFilterChange("hasConfig", value)}>
                <SelectTrigger className="text-sm bg-white/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cameras</SelectItem>
                  <SelectItem value="yes">With Config</SelectItem>
                  <SelectItem value="no">Without Config</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger className="text-sm bg-white/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="updated">Updated Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
