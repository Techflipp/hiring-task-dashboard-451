"use client";

import { X } from "lucide-react";
import { Button } from "./button";

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  children,
}: ActionSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 lg:hidden animate-in slide-in-from-bottom">
        <div className="p-4">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          <div className="space-y-2">{children}</div>
        </div>
        <div className="safe-bottom" />
      </div>
    </>
  );
}
