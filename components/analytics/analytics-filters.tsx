"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient } from "@/lib/api-client"
import { Gender, Age, Emotion, EthnicGroup } from "@/types/api"

export function AnalyticsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { data: cameras } = useQuery({
    queryKey: ["cameras", { page: 1, size: 1000 }],
    queryFn: () => apiClient.getCameras({ page: 1, size: 1000 }),
  })

  // Initialize filters from URL params only once
  const [filters, setFilters] = useState(() => ({
    camera_id: searchParams.get("camera_id") || "",
    gender: searchParams.get("gender") || "all",
    age: searchParams.get("age") || "all",
    emotion: searchParams.get("emotion") || "all",
    ethnicity: searchParams.get("ethnicity") || "all",
    start_date: searchParams.get("start_date") || "",
    end_date: searchParams.get("end_date") || "",
  }))

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Only auto-apply when camera is selected, not for other filters
    if (key === "camera_id") {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([k, v]) => {
        if (v && v !== "all" && v.trim() !== "") {
          params.set(k, v)
        }
      })
      router.push(`/analytics?${params.toString()}`)
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value.trim() !== "") {
        params.set(key, value)
      }
    })

    router.push(`/analytics?${params.toString()}`)
  }

  const clearFilters = () => {
    const clearedFilters = {
      camera_id: "",
      gender: "all",
      age: "all",
      emotion: "all",
      ethnicity: "all",
      start_date: "",
      end_date: "",
    }
    setFilters(clearedFilters)
    router.push("/analytics")
  }

  const availableCameras = cameras?.items?.filter((camera: any) => camera.demographics_config) || []

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
        <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filters</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Camera</Label>
          <Select value={filters.camera_id} onValueChange={(value) => handleFilterChange("camera_id", value)}>
            <SelectTrigger className="text-xs sm:text-sm">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {availableCameras.map((camera: any) => (
                <SelectItem key={camera.id} value={camera.id}>
                  {camera.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Gender</Label>
          <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
            <SelectTrigger className="text-xs sm:text-sm">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genders</SelectItem>
              <SelectItem value={Gender.MALE}>Male</SelectItem>
              <SelectItem value={Gender.FEMALE}>Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Age Group</Label>
          <Select value={filters.age} onValueChange={(value) => handleFilterChange("age", value)}>
            <SelectTrigger className="text-xs sm:text-sm">
              <SelectValue placeholder="All ages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ages</SelectItem>
              <SelectItem value={Age.ZERO_EIGHTEEN}>0-18</SelectItem>
              <SelectItem value={Age.NINETEEN_THIRTY}>19-30</SelectItem>
              <SelectItem value={Age.THIRTYONE_FORTYFIVE}>31-45</SelectItem>
              <SelectItem value={Age.FORTYSIX_SIXTY}>46-60</SelectItem>
              <SelectItem value={Age.SIXTYPLUS}>60+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Emotion</Label>
          <Select value={filters.emotion} onValueChange={(value) => handleFilterChange("emotion", value)}>
            <SelectTrigger className="text-xs sm:text-sm">
              <SelectValue placeholder="All emotions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All emotions</SelectItem>
              <SelectItem value={Emotion.HAPPY}>Happy</SelectItem>
              <SelectItem value={Emotion.NEUTRAL}>Neutral</SelectItem>
              <SelectItem value={Emotion.SAD}>Sad</SelectItem>
              <SelectItem value={Emotion.ANGRY}>Angry</SelectItem>
              <SelectItem value={Emotion.SURPRISE}>Surprise</SelectItem>
              <SelectItem value={Emotion.FEAR}>Fear</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Ethnicity</Label>
          <Select value={filters.ethnicity} onValueChange={(value) => handleFilterChange("ethnicity", value)}>
            <SelectTrigger className="text-xs sm:text-sm">
              <SelectValue placeholder="All ethnicities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ethnicities</SelectItem>
              <SelectItem value={EthnicGroup.WHITE}>White</SelectItem>
              <SelectItem value={EthnicGroup.AFRICAN}>African</SelectItem>
              <SelectItem value={EthnicGroup.SOUTH_ASIAN}>South Asian</SelectItem>
              <SelectItem value={EthnicGroup.EAST_ASIAN}>East Asian</SelectItem>
              <SelectItem value={EthnicGroup.MIDDLE_EASTERN}>Middle Eastern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">Start Date</Label>
          <Input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange("start_date", e.target.value)}
            className="text-xs sm:text-sm"
          />
        </div>

        <div>
          <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">End Date</Label>
          <Input
            type="date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange("end_date", e.target.value)}
            className="text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button onClick={applyFilters} className="btn-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs sm:text-sm">
          Apply Filters
        </Button>

        <Button
          onClick={clearFilters}
          variant="outline"
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-white/20 bg-white/50 hover:bg-white/80 text-xs sm:text-sm"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
