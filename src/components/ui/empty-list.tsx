import type React from 'react'
import type { ReactNode } from 'react'
import { CameraOff, FileQuestion } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description: string
  icon?: 'camera' | 'file' | 'custom'
  customIcon?: ReactNode
}

export const EmptyState = ({ title, description, icon = 'file', customIcon }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
        {customIcon ? (
          customIcon
        ) : icon === 'camera' ? (
          <CameraOff className="text-muted-foreground h-10 w-10" />
        ) : (
          <FileQuestion className="text-muted-foreground h-10 w-10" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">{description}</p>
    </div>
  )
}
