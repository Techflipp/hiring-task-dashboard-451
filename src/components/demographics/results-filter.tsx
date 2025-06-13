'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { Age, Emotion, EthnicGroup, Gender } from '@/lib/types'
import { cn } from '@/lib/utils'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export const ResultsFilter = ({ cameraId }: {
  cameraId: string
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [gender, setGender] = useState<Gender | 'all' | ''>('')
  const [age, setAge] = useState<Age | 'all' | ''>('')
  const [emotion, setEmotion] = useState<Emotion | 'all' | ''>('')
  const [ethnicity, setEthnicity] = useState<EthnicGroup | 'all' | ''>('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Initialize state from URL params
  useEffect(() => {
    const genderParam = searchParams.get('gender')
    const ageParam = searchParams.get('age')
    const emotionParam = searchParams.get('emotion')
    const ethnicityParam = searchParams.get('ethnicity')
    const startDateParam = searchParams.get('start_date')
    const endDateParam = searchParams.get('end_date')

    setGender(genderParam ? (genderParam as Gender) : '')
    setAge(ageParam ? (ageParam as Age) : '')
    setEmotion(emotionParam ? (emotionParam as Emotion) : '')
    setEthnicity(ethnicityParam ? (ethnicityParam as EthnicGroup) : '')
    setStartDate(startDateParam ? new Date(startDateParam) : undefined)
    setEndDate(endDateParam ? new Date(endDateParam) : undefined)
  }, [searchParams])

  const applyFilters = () => {
    const params = new URLSearchParams()
    params.set('camera_id', cameraId)

    if (gender && gender !== 'all') params.set('gender', gender)
    if (age && age !== 'all') params.set('age', age)
    if (emotion && emotion !== 'all') params.set('emotion', emotion)
    if (ethnicity && ethnicity !== 'all') params.set('ethnicity', ethnicity)
    if (startDate) params.set('start_date', startDate.toISOString())
    if (endDate) params.set('end_date', endDate.toISOString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setGender('')
    setAge('')
    setEmotion('')
    setEthnicity('')
    setStartDate(undefined)
    setEndDate(undefined)

    router.push(`${pathname}?camera_id=${cameraId}`)
  }

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Filter Results</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Gender</Label>
          <Select
            value={gender}
            onValueChange={(value) => setGender(value as Gender | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genders</SelectItem>
              <SelectItem value={Gender.MALE}>Male</SelectItem>
              <SelectItem value={Gender.FEMALE}>Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Age Group</Label>
          <Select
            value={age}
            onValueChange={(value) => setAge(value as Age | 'all')}
          >
            <SelectTrigger>
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

        <div className="space-y-2">
          <Label className="text-sm font-medium">Emotion</Label>
          <Select
            value={emotion}
            onValueChange={(value) => setEmotion(value as Emotion | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="All emotions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All emotions</SelectItem>
              <SelectItem value={Emotion.ANGRY}>Angry</SelectItem>
              <SelectItem value={Emotion.FEAR}>Fear</SelectItem>
              <SelectItem value={Emotion.HAPPY}>Happy</SelectItem>
              <SelectItem value={Emotion.NEUTRAL}>Neutral</SelectItem>
              <SelectItem value={Emotion.SAD}>Sad</SelectItem>
              <SelectItem value={Emotion.SURPRISE}>Surprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Ethnicity</Label>
          <Select
            value={ethnicity}
            onValueChange={(value) => setEthnicity(value as EthnicGroup | 'all')}
          >
            <SelectTrigger>
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

        <div className="space-y-2">
          <Label className="text-sm font-medium">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={resetFilters}
        >
          Reset
        </Button>
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}
