"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface PageSizeSelectorProps {
  value: number
  onChange: (size: number) => void
  options: number[]
}

export function PageSizeSelector({ value, onChange, options }: PageSizeSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="page-size" className="text-sm whitespace-nowrap">
        Show:
      </Label>
      <Select value={value.toString()} onValueChange={(val) => onChange(Number.parseInt(val))}>
        <SelectTrigger id="page-size" className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
