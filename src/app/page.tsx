import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Camera, BarChart3, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Camera Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your cameras and analyze demographic data with powerful insights
        </p>
        <Link href="/cameras">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Camera Management</h3>
          <p className="text-gray-600">
            Easily manage and configure your cameras with intuitive controls
          </p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Settings className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Demographics Config</h3>
          <p className="text-gray-600">
            Configure demographic detection parameters for each camera
          </p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
          <p className="text-gray-600">
            View detailed analytics and demographic insights from your cameras
          </p>
        </div>
      </div>
    </div>
  );
}