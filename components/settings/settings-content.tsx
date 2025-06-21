"use client"

import { useState, useEffect } from "react"
import { Save, Bell, Shield, Database, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function SettingsContent() {
  const { toast } = useToast()

  const [settings, setSettings] = useState({
    notifications: {
      email_alerts: true,
      push_notifications: false,
      alert_threshold: "high",
    },
    security: {
      session_timeout: "30",
      require_2fa: false,
      password_expiry: "90",
    },
    system: {
      auto_backup: true,
      backup_frequency: "daily",
      log_retention: "30",
      max_concurrent_streams: "10",
    },
    display: {
      theme: "light",
      language: "en",
      timezone: "UTC",
    },
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem("cameraVisionSettings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)

        if (parsed.display.theme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("cameraVisionSettings", JSON.stringify(settings))

    if (settings.display.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    const changes = []
    if (settings.notifications.email_alerts) changes.push("Email alerts enabled")
    if (settings.security.require_2fa) changes.push("2FA requirement enabled")
    if (settings.system.auto_backup) changes.push("Auto backup enabled")

    toast({
      title: "Settings Saved Successfully",
      description: `Applied changes: ${changes.join(", ") || "Settings updated"}`,
    })

    if (settings.notifications.push_notifications) {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("CameraVision Settings", {
              body: "Push notifications have been enabled!",
              icon: "/favicon.ico",
            })
          }
        })
      }
    }
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const resetToDefaults = () => {
    const defaultSettings = {
      notifications: {
        email_alerts: true,
        push_notifications: false,
        alert_threshold: "high",
      },
      security: {
        session_timeout: "30",
        require_2fa: false,
        password_expiry: "90",
      },
      system: {
        auto_backup: true,
        backup_frequency: "daily",
        log_retention: "30",
        max_concurrent_streams: "10",
      },
      display: {
        theme: "light",
        language: "en",
        timezone: "UTC",
      },
    }

    setSettings(defaultSettings)
    localStorage.setItem("cameraVisionSettings", JSON.stringify(defaultSettings))
    document.documentElement.classList.remove("dark")

    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">Email Alerts</Label>
              <p className="text-xs sm:text-sm text-gray-600">Receive email notifications for system alerts</p>
            </div>
            <Switch
              checked={settings.notifications.email_alerts}
              onCheckedChange={(checked) => updateSetting("notifications", "email_alerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">Push Notifications</Label>
              <p className="text-xs sm:text-sm text-gray-600">Receive browser push notifications</p>
            </div>
            <Switch
              checked={settings.notifications.push_notifications}
              onCheckedChange={(checked) => updateSetting("notifications", "push_notifications", checked)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Alert Threshold</Label>
            <Select
              value={settings.notifications.alert_threshold}
              onValueChange={(value) => updateSetting("notifications", "alert_threshold", value)}
            >
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - All alerts</SelectItem>
                <SelectItem value="medium">Medium - Important alerts</SelectItem>
                <SelectItem value="high">High - Critical alerts only</SelectItem>
                <SelectItem value="critical">Critical - System failures only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Security</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label htmlFor="session_timeout" className="text-sm font-medium text-gray-700">
              Session Timeout (minutes)
            </Label>
            <Input
              id="session_timeout"
              type="number"
              min="5"
              max="480"
              value={settings.security.session_timeout}
              onChange={(e) => updateSetting("security", "session_timeout", e.target.value)}
              className="mt-1 text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">Current: {settings.security.session_timeout} minutes</p>
          </div>

          <div>
            <Label htmlFor="password_expiry" className="text-sm font-medium text-gray-700">
              Password Expiry (days)
            </Label>
            <Input
              id="password_expiry"
              type="number"
              min="30"
              max="365"
              value={settings.security.password_expiry}
              onChange={(e) => updateSetting("security", "password_expiry", e.target.value)}
              className="mt-1 text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">Current: {settings.security.password_expiry} days</p>
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-700">Require Two-Factor Authentication</Label>
                <p className="text-xs sm:text-sm text-gray-600">Enable 2FA for all user accounts</p>
              </div>
              <Switch
                checked={settings.security.require_2fa}
                onCheckedChange={(checked) => updateSetting("security", "require_2fa", checked)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">System</h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-gray-700">Auto Backup</Label>
              <p className="text-xs sm:text-sm text-gray-600">Automatically backup system data</p>
            </div>
            <Switch
              checked={settings.system.auto_backup}
              onCheckedChange={(checked) => updateSetting("system", "auto_backup", checked)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Backup Frequency</Label>
              <Select
                value={settings.system.backup_frequency}
                onValueChange={(value) => updateSetting("system", "backup_frequency", value)}
                disabled={!settings.system.auto_backup}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="log_retention" className="text-sm font-medium text-gray-700">
                Log Retention (days)
              </Label>
              <Input
                id="log_retention"
                type="number"
                min="7"
                max="365"
                value={settings.system.log_retention}
                onChange={(e) => updateSetting("system", "log_retention", e.target.value)}
                className="mt-1 text-sm sm:text-base"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="max_streams" className="text-sm font-medium text-gray-700">
                Max Concurrent Streams
              </Label>
              <Input
                id="max_streams"
                type="number"
                min="1"
                max="50"
                value={settings.system.max_concurrent_streams}
                onChange={(e) => updateSetting("system", "max_concurrent_streams", e.target.value)}
                className="mt-1 text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current limit: {settings.system.max_concurrent_streams} streams
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Display</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Theme</Label>
            <Select value={settings.display.theme} onValueChange={(value) => updateSetting("display", "theme", value)}>
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light Mode</SelectItem>
                <SelectItem value="dark">Dark Mode</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Language</Label>
            <Select
              value={settings.display.language}
              onValueChange={(value) => updateSetting("display", "language", value)}
            >
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Timezone</Label>
            <Select
              value={settings.display.timezone}
              onValueChange={(value) => updateSetting("display", "timezone", value)}
            >
              <SelectTrigger className="text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                <SelectItem value="EST">Eastern Time (GMT-5)</SelectItem>
                <SelectItem value="PST">Pacific Time (GMT-8)</SelectItem>
                <SelectItem value="CET">Central European (GMT+1)</SelectItem>
                <SelectItem value="JST">Japan Standard (GMT+9)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <Button
          onClick={resetToDefaults}
          variant="outline"
          className="px-6 py-3 rounded-xl border-white/20 bg-white/50 hover:bg-white/80 text-sm sm:text-base"
        >
          Reset to Defaults
        </Button>

        <Button
          onClick={handleSave}
          className="btn-gradient px-6 py-3 rounded-xl flex items-center space-x-2 text-sm sm:text-base"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Save All Settings</span>
        </Button>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Configuration Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <span className="text-gray-600">Email Alerts:</span>{" "}
            <span className={settings.notifications.email_alerts ? "text-green-600" : "text-red-600"}>
              {settings.notifications.email_alerts ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">2FA Required:</span>{" "}
            <span className={settings.security.require_2fa ? "text-green-600" : "text-red-600"}>
              {settings.security.require_2fa ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Auto Backup:</span>{" "}
            <span className={settings.system.auto_backup ? "text-green-600" : "text-red-600"}>
              {settings.system.auto_backup ? `${settings.system.backup_frequency}` : "Disabled"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Theme:</span>{" "}
            <span className="text-blue-600 capitalize">{settings.display.theme}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
