import React from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Camera Management</span>
          </Link>
          <nav className="flex space-x-8">
            <Link
              href="/cameras"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Cameras
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};