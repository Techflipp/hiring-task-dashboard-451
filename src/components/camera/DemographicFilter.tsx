'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
// import { } from '@/components/ui/DatePicker' // We'll make this if you don't have it yet

interface Props {
  onFilterChange: Dispatch<SetStateAction<Record<string,string>>>
}

export const DemographicsFilters = ({ onFilterChange }: Props) => {
  const [formState, setFormState] = useState({
    gender: '',
    age: '',
    emotion: '',
    ethnicity: '',
    start_date: '',
    end_date: '',
  })

  const handleInput = (key: string, value: string) => {
    const updated = { ...formState, [key]: value }
    setFormState(updated)
    onFilterChange(updated)
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Select onValueChange={(val) => handleInput('gender', val)}>
        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleInput('age', val)}>
        <SelectTrigger><SelectValue placeholder="Age Group" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="0-18">0-18</SelectItem>
          <SelectItem value="19-30">19-30</SelectItem>
          <SelectItem value="31-45">31-45</SelectItem>
          <SelectItem value="46-60">46-60</SelectItem>
          <SelectItem value="60+">60+</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleInput('emotion', val)}>
        <SelectTrigger><SelectValue placeholder="Emotion" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="happy">Happy</SelectItem>
          <SelectItem value="sad">Sad</SelectItem>
          <SelectItem value="neutral">Neutral</SelectItem>
          <SelectItem value="angry">Angry</SelectItem>
          <SelectItem value="fear">Fear</SelectItem>
          <SelectItem value="surprise">Surprise</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleInput('ethnicity', val)}>
        <SelectTrigger><SelectValue placeholder="Ethnicity" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="white">White</SelectItem>
          <SelectItem value="african">African</SelectItem>
          <SelectItem value="south_asian">South Asian</SelectItem>
          <SelectItem value="east_asian">East Asian</SelectItem>
          <SelectItem value="middle_eastern">Middle Eastern</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
