import Link from "next/link"
import { Plus, BarChart3, Settings, Camera } from "lucide-react"

const actions = [
  {
    title: "Add Camera",
    description: "Set up a new camera",
    href: "/cameras/new",
    icon: Plus,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "View Analytics",
    description: "Check demographics data",
    href: "/analytics",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Manage Cameras",
    description: "Edit camera settings",
    href: "/cameras",
    icon: Camera,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "System Settings",
    description: "Configure system",
    href: "/settings",
    icon: Settings,
    color: "from-orange-500 to-red-500",
  },
]

export function QuickActions() {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>

      <div className="space-y-3 sm:space-y-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              href={action.href}
              className="block p-3 sm:p-4 rounded-xl bg-white/50 hover:bg-white/80 border border-white/20 hover:border-white/40 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
