'use client';

import Link from 'next/link';
import { Camera, BarChart3, Shield, Zap, Users, TrendingUp, ChevronRight, ArrowRight, CheckCircle, Eye, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { useCameras } from '@/hooks/use-api';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const { data: camerasData } = useCameras({ page: 1, size: 5 });

  const features = [
    {
      icon: Camera,
      title: 'Camera Management',
      description: 'Manage your entire camera network from a single, intuitive dashboard.',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get detailed insights and analytics from your camera feeds with AI-powered analysis.',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Users,
      title: 'Demographic Analysis',
      description: 'Understand visitor patterns and demographics with advanced computer vision.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime and encrypted data transmission.',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Process video feeds in real-time with low-latency streaming and instant alerts.',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: TrendingUp,
      title: 'Scalable Infrastructure',
      description: 'Scale from single cameras to enterprise deployments with cloud-native architecture.',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  const stats = [
    { 
      label: 'Active Cameras', 
      value: camerasData?.items?.filter(c => c.is_active).length || 24,
      trend: '+12% from last month',
      trendUp: true
    },
    { 
      label: 'Demographics Analyzed', 
      value: '156.2K',
      trend: '+23% from last month',
      trendUp: true
    },
    { 
      label: 'Detection Accuracy', 
      value: '98.7%',
      trend: '+2.1% from last month',
      trendUp: true
    },
    { 
      label: 'System Uptime', 
      value: '99.9%',
      trend: '+0.1% from last month',
      trendUp: true
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium shadow-sm">
              🚀 Now with AI-powered analytics
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
              Intelligent Camera
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-700 dark:text-gray-300">
              Monitor, analyze, and manage your camera network with advanced AI-powered insights. 
              Get real-time analytics, demographic data, and comprehensive security monitoring all in one place.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Button asChild size="lg" className="shadow-xl hover:shadow-2xl transition-shadow duration-300 px-8 py-3">
                <Link href="/cameras">
                  <Camera className="mr-2 h-5 w-5" />
                  View Cameras
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="px-8 py-3 border-2 hover:bg-muted/50">
                <Link href="/analytics">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analytics Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time Monitoring
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                AI-Powered Analytics
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Enterprise Security
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
              Platform Overview
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Real-time insights into your camera network performance
            </p>
          </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const icons = [Eye, Users, Target, Shield];
              const colors = [
                'text-white',
                'text-white',
                'text-white',
                'text-white'
              ];
              const bgColors = [
                'bg-blue-500',
                'bg-green-500',
                'bg-orange-500', 
                'bg-red-500'
              ];
              const Icon = icons[index];
              
              return (
                <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          {stat.label}
                        </dt>
                        <dd className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
                          {stat.value}
                        </dd>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${bgColors[index]} shadow-lg`}>
                        <Icon className={`h-7 w-7 ${colors[index]}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              ✨ Core Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-gray-900 dark:text-gray-100 mb-6">
              Everything you need to manage your camera network
            </h2>
            <p className="mt-4 text-xl leading-8 text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features designed for modern security and analytics needs with enterprise-grade reliability
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-muted/50 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-4">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Cameras Section */}
      {camerasData && camerasData.items.length > 0 && (
        <section className="bg-gradient-to-b from-muted/30 to-muted/10 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16">
              <div className="mb-6 sm:mb-0">
                <Badge variant="outline" className="mb-4 px-3 py-1">
                  📹 Live Network
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
                  Recent Cameras
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Your latest camera additions and configurations
                </p>
              </div>
              <Button variant="outline" asChild className="px-6 py-3 border-2 hover:bg-background/80">
                <Link href="/cameras">
                  View All Cameras
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {camerasData.items.slice(0, 3).map((camera) => (
                <Card key={camera.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-muted/50 bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Camera className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {camera.name}
                        </CardTitle>
                      </div>
                      <Badge 
                        variant={camera.is_active ? "active" : "inactive"} 
                        className="gap-1"
                      >
                        <div className={`w-2 h-2 rounded-full ${camera.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {camera.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      Created {formatDate(camera.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        RTSP Endpoint
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-mono truncate bg-background/50 px-3 py-2 rounded border">
                        {camera.rtsp_url}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-muted/50">
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-mono bg-muted/30 px-2 py-1 rounded">
                        ID: {camera.id.slice(0, 8)}...
                      </span>
                      <Button variant="outline" size="sm" asChild className="hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                        <Link href={`/cameras/${camera.id}`}>
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 shadow-2xl">
            <CardContent className="px-8 py-16 text-center lg:px-16">
              <Badge variant="outline" className="mb-6 px-4 py-2 border-primary/30">
                🚀 Ready to Get Started?
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-6 text-gray-900 dark:text-gray-100 lg:text-4xl">
                Ready to transform your camera network?
              </h2>
              <p className="text-xl leading-8 text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
                Join thousands of organizations using our platform to monitor, analyze, 
                and secure their environments with intelligent camera management and AI-powered insights.
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Enterprise Security
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  99.9% Uptime SLA
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  24/7 Support
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="shadow-xl hover:shadow-2xl transition-shadow duration-300 px-8 py-4 text-lg">
                  <Link href="/cameras">
                    <Camera className="mr-2 h-5 w-5" />
                    Get Started Now
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8 py-4 text-lg border-2 hover:bg-primary/10 hover:border-primary/30">
                  <Link href="/analytics">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    View Live Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
