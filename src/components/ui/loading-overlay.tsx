import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}>
      <div className="flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
