"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-lg">CameraHub</span>
            </Link>
            <div className="hidden lg:flex space-x-4">
              <Link
                href="/cameras"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/cameras")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}>
                Cameras
              </Link>
              <Link
                href="/demographics"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors",
                  isActive("/demographics")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}>
                <BarChart3 className="h-4 w-4 mr-1" />
                Demographics
              </Link>
            </div>
          </div>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
