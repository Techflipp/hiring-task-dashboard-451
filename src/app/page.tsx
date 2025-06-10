import Link from 'next/link';
import { Camera, BarChart3, Settings, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Camera Management System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your camera network and analyze demographic data with advanced analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Cameras"
          description="View and manage all cameras"
          icon={<Camera className="h-8 w-8" />}
          href="/cameras"
          color="bg-blue-500"
        />
        
        <DashboardCard
          title="Analytics"
          description="View demographic insights"
          icon={<BarChart3 className="h-8 w-8" />}
          href="/analytics"
          color="bg-green-500"
        />
        
        <DashboardCard
          title="Demographics"
          description="Configure detection settings"
          icon={<Users className="h-8 w-8" />}
          href="/cameras"
          color="bg-purple-500"
        />
        
        <DashboardCard
          title="Settings"
          description="System configuration"
          icon={<Settings className="h-8 w-8" />}
          href="/settings"
          color="bg-orange-500"
        />
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  icon, 
  href, 
  color 
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className={`inline-flex p-3 rounded-lg text-white mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}