import Link from "next/link";
import { 
  Camera, 
  BarChart3, 
  Settings, 
  Users, 
  Activity, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Play,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  const features = [
    {
      title: "Camera Management",
      description: "Efficiently manage and monitor your camera network with real-time status updates and comprehensive configuration options.",
      icon: Camera,
      href: "/cameras",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "Analytics Dashboard",
      description: "Gain powerful insights from demographics data with advanced filtering, visualizations, and real-time analytics.",
      icon: BarChart3,
      href: "/analytics",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      title: "Demographics Configuration",
      description: "Configure advanced demographics detection parameters and fine-tune AI models for optimal performance.",
      icon: Settings,
      href: "/cameras",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-50 to-emerald-100"
    }
  ];

  const stats = [
    {
      title: "Active Cameras",
      value: "24",
      change: "+12%",
      icon: Eye,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Demographics Analyzed",
      value: "156.2K",
      change: "+23%",
      icon: Users,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Detection Accuracy",
      value: "98.7%",
      change: "+2.1%",
      icon: Zap,
      color: "from-amber-500 to-amber-600"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      change: "+0.1%",
      icon: Shield,
      color: "from-rose-500 to-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Camera Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Powerful AI-driven camera management and demographics analytics platform. 
              Monitor, analyze, and optimize your camera network with advanced real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cameras">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8 py-3 text-lg flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-emerald-600 font-medium mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Camera Management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage, monitor, and analyze your camera network in one comprehensive platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              >
                <Link href={feature.href}>
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {/* <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white mb-16">
          <CardContent className="p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  Set up your first camera or explore our powerful analytics dashboard to see your demographics data in action.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/cameras">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Manage Cameras
                    </Button>
                  </Link>
                  <Link href="/analytics">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 opacity-20">
                  <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Camera className="h-12 w-12" />
                  </div>
                  <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="h-12 w-12" />
                  </div>
                  <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Users className="h-12 w-12" />
                  </div>
                  <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Activity className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Activity Mock */}
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">All Systems Operational</span>
                  </div>
                  <span className="text-sm text-gray-600">2 min ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Camera Network Optimized</span>
                  </div>
                  <span className="text-sm text-gray-600">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">AI Model Updated</span>
                  </div>
                  <span className="text-sm text-gray-600">3 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Detection Accuracy</span>
                    <span>98.7%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '98.7%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Processing Speed</span>
                    <span>94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Network Uptime</span>
                    <span>99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
