"use client"

import { type Camera, Gender, Age, Emotion, EthnicGroup } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import { formatEnumValue } from "@/lib/utils"

interface AnalyticsFiltersProps {
  cameras: Camera[]
  filters: {
    camera_id: string
    gender?: string
    age?: string
    emotion?: string
    ethnicity?: string
    start_date?: string
    end_date?: string
  }
  onFiltersChange: (filters: any) => void
}

export function AnalyticsFilters({ cameras, filters, onFiltersChange }: AnalyticsFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ [key]: value || undefined })
  }

  const clearFilters = () => {
    onFiltersChange({
      camera_id: filters.camera_id,
      gender: undefined,
      age: undefined,
      emotion: undefined,
      ethnicity: undefined,
      start_date: undefined,
      end_date: undefined,
    })
  }

  const hasActiveFilters =
    filters.gender || filters.age || filters.emotion || filters.ethnicity || filters.start_date || filters.end_date

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Analytics Filters
        </CardTitle>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="camera-select">Camera *</Label>
            <Select value={filters.camera_id} onValueChange={(value) => handleFilterChange("camera_id", value)}>
              <SelectTrigger id="camera-select">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="gender-select">Gender</Label>
            <Select value={filters.gender || ""} onValueChange={(value) => handleFilterChange("gender", value)}>
              <SelectTrigger id="gender-select">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All genders</SelectItem>
                {Object.values(Gender).map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {formatEnumValue(gender)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age-select">Age Group</Label>
            <Select value={filters.age || ""} onValueChange={(value) => handleFilterChange("age", value)}>
              <SelectTrigger id="age-select">
                <SelectValue placeholder="All ages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ages</SelectItem>
                {Object.values(Age).map((age) => (
                  <SelectItem key={age} value={age}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="emotion-select">Emotion</Label>
            <Select value={filters.emotion || ""} onValueChange={(value) => handleFilterChange("emotion", value)}>
              <SelectTrigger id="emotion-select">
                <SelectValue placeholder="All emotions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All emotions</SelectItem>
                {Object.values(Emotion).map((emotion) => (
                  <SelectItem key={emotion} value={emotion}>
                    {formatEnumValue(emotion)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ethnicity-select">Ethnicity</Label>
            <Select value={filters.ethnicity || ""} onValueChange={(value) => handleFilterChange("ethnicity", value)}>
              <SelectTrigger id="ethnicity-select">
                <SelectValue placeholder="All ethnicities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ethnicities</SelectItem>
                {Object.values(EthnicGroup).map((ethnicity) => (
                  <SelectItem key={ethnicity} value={ethnicity}>
                    {formatEnumValue(ethnicity)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="datetime-local"
              value={filters.start_date || ""}
              onChange={(e) => handleFilterChange("start_date", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="datetime-local"
              value={filters.end_date || ""}
              onChange={(e) => handleFilterChange("end_date", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
