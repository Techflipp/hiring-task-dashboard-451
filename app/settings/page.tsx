import { Suspense } from "react"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">System Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Configure system preferences and settings</p>
      </div>

      <Suspense fallback={<div className="h-96 glass-card rounded-2xl animate-pulse" />}>
        <SettingsContent />
      </Suspense>
    </div>
  )
}
