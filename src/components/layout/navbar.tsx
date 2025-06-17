'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Cameras', href: '/cameras', icon: Camera },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Camera className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">CameraDash</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
                      isActive
                        ? 'border-blue-500 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-colors'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 