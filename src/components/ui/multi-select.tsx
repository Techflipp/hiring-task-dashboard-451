'use client'

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'

interface MultiSelectProps {
  options: {
    value: string
    label: string
  }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const handleUnselect = (value: string) => {
    onChange(selected.filter((s) => s !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((s) => s !== value))
    } else {
      onChange([...selected, value])
    }
    setInputValue('')
  }

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false)
    }, 150)
  }

  return (
    <Command className={`overflow-visible bg-transparent ${className}`}>
      <div className="group border-input ring-offset-background focus-within:ring-ring rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value)
            return (
              <Badge
                key={value}
                variant="secondary"
              >
                {option?.label}
                <button
                  className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                  onClick={() => handleUnselect(value)}
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : undefined}
            className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
          />
        </div>
      </div>
      <div className="relative">
        {open && (
          <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-10 w-full rounded-md border shadow-md outline-none">
            <CommandGroup className="h-full max-h-[200px] overflow-auto">
              {options.map((option) => {
                const isSelected = selected.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(option.value)
                    }}
                    className={`flex items-center gap-2 cursor-pointer ${isSelected ? 'bg-accent' : ''}`}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-input ${isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background'
                        }`}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    {option.label}
                  </CommandItem>
                )
              })}
              {options.length === 0 && <CommandItem disabled>No options found.</CommandItem>}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
