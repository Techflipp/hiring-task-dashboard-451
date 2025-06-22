"use client"

import { Clock, Camera, Settings } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "camera_added",
    message: 'New camera "Main Entrance" was added',
    time: "2 minutes ago",
    icon: Camera,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    type: "config_updated",
    message: 'Demographics config updated for "Lobby Camera"',
    time: "15 minutes ago",
    icon: Settings,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 3,
    type: "camera_added",
    message: 'Camera "Parking Lot" stream started',
    time: "1 hour ago",
    icon: Camera,
    color: "from-green-500 to-emerald-500",
  },
]

export function RecentActivity() {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity</h2>
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
