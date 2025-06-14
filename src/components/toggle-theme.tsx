'use client'

import { useId, useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export const ToggleTheme = () => {
  const id = useId()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [checked, setChecked] = useState<boolean>(false)

  // Sync local state with current theme
  useEffect(() => {
    const currentTheme = theme === 'system' ? resolvedTheme : theme
    setChecked(currentTheme === 'dark')
  }, [theme, resolvedTheme])

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(checked) => {
          setChecked(checked)
          setTheme(checked ? 'dark' : 'light')
        }}
        aria-label="Toggle theme"
      />
      <Label htmlFor={id}>
        <span className="sr-only">Toggle theme</span>
        {checked ? (
          <MoonIcon
            size={16}
            aria-hidden="true"
          />
        ) : (
          <SunIcon
            size={16}
            aria-hidden="true"
          />
        )}
      </Label>
    </div>
  )
}
