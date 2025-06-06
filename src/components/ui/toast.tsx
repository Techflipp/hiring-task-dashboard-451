"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
  duration?: number;
}

// interface ToastContextValue {
//   toasts: ToastProps[];
//   addToast: (toast: Omit<ToastProps, "id">) => void;
//   removeToast: (id: string) => void;
// }

export function Toast({
  title,
  description,
  variant = "default",
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const variants = {
    default: "bg-white border-gray-200",
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
  };

  const titleVariants = {
    default: "text-gray-900",
    success: "text-green-900",
    error: "text-red-900",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "animate-in slide-in-from-top-5 fade-in-0 w-full max-w-sm rounded-lg border p-4 shadow-lg",
        variants[variant]
      )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn("font-medium", titleVariants[variant])}>{title}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 inline-flex rounded-md text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
