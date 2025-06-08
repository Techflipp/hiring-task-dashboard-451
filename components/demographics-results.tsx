"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format, subDays } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { CalendarIcon, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDemographicsResults } from "@/lib/demographics"
import type { Gender, Age, Emotion, EthnicGroup, DemographicsResult } from "@/lib/types"

interface DemographicsResultsProps {
  cameraId: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export default function DemographicsResults({ cameraId }: DemographicsResultsProps) {
  const [gender, setGender] = useState<Gender | undefined>(undefined)
  const [age, setAge] = useState<Age | undefined>(undefined)
  const [emotion, setEmotion] = useState<Emotion | undefined>(undefined)
  const [ethnicity, setEthnicity] = useState<EthnicGroup | undefined>(undefined)
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())

  const { data, isLoading, error } = useQuery({
    queryKey: ["demographics", cameraId, gender, age, emotion, ethnicity, startDate, endDate],
    queryFn: () =>
      getDemographicsResults({
        camera_id: cameraId,
        gender,
        age,
        emotion,
        ethnicity,
        start_date: startDate ? format(startDate, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
        end_date: endDate ? format(endDate, "yyyy-MM-dd'T'HH:mm:ss") : undefined,
      }),
  })

  const resetFilters = () => {
    setGender(undefined)
    setAge(undefined)
    setEmotion(undefined)
    setEthnicity(undefined)
    setStartDate(subDays(new Date(), 7))
    setEndDate(new Date())
  }

  // Process data for charts
  const processGenderData = () => {
    if (!data?.results) return []

    const genderCounts: Record<string, number> = {}
    data.results.forEach((result: DemographicsResult) => {
      genderCounts[result.gender] = (genderCounts[result.gender] || 0) + 1
    })

    return Object.entries(genderCounts).map(([gender, count]) => ({
      name: gender.charAt(0).toUpperCase() + gender.slice(1),
      value: count,
    }))
  }

  const processAgeData = () => {
    if (!data?.results) return []

    const ageCounts: Record<string, number> = {}
    data.results.forEach((result: DemographicsResult) => {
      ageCounts[result.age] = (ageCounts[result.age] || 0) + 1
    })

    return Object.entries(ageCounts).map(([age, count]) => ({
      name: age,
      count,
    }))
  }

  const processEmotionData = () => {
    if (!data?.results) return []

    const emotionCounts: Record<string, number> = {}
    data.results.forEach((result: DemographicsResult) => {
      emotionCounts[result.emotion] = (emotionCounts[result.emotion] || 0) + 1
    })

    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      name: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      count,
    }))
  }

  const processEthnicityData = () => {
    if (!data?.results) return []

    const ethnicityCounts: Record<string, number> = {}
    data.results.forEach((result: DemographicsResult) => {
      ethnicityCounts[result.ethnicity] = (ethnicityCounts[result.ethnicity] || 0) + 1
    })

    return Object.entries(ethnicityCounts).map(([ethnicity, count]) => ({
      name: ethnicity
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      value: count,
    }))
  }

  const genderData = processGenderData()
  const ageData = processAgeData()
  const emotionData = processEmotionData()
  const ethnicityData = processEthnicityData()

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <p className="text-red-500">Error loading demographics data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle>Demographics Analytics</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"} -
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={{
                    from: startDate || new Date(),
                    to: endDate || new Date(),
                  }}
                  onSelect={(range) => {
                    setStartDate(range?.from)
                    setEndDate(range?.to)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={gender} onValueChange={(value) => setGender((value as Gender) || undefined)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={age} onValueChange={(value) => setAge((value as Age) || undefined)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-18">0-18</SelectItem>
                <SelectItem value="19-30">19-30</SelectItem>
                <SelectItem value="31-45">31-45</SelectItem>
                <SelectItem value="46-60">46-60</SelectItem>
                <SelectItem value="60+">60+</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" onClick={resetFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : !data?.results?.length ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No demographics data available for the selected filters.</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gender">Gender</TabsTrigger>
              <TabsTrigger value="age">Age</TabsTrigger>
              <TabsTrigger value="ethnicity">Ethnicity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Emotion Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={emotionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gender">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="age">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="ethnicity">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ethnicity Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={ethnicityData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {ethnicityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
